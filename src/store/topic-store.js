import {
  observable,
  action,
  extendObservable,
  computed,
  toJS,
} from 'mobx';
import { get, post } from '../util/http';
import { topicSchema, replySchema } from '../util/variable-define';

const createTopic = (topic) => {
  return Object.assign({}, topicSchema, topic)
};

const createReply = (topic) => {
  return Object.assign({}, replySchema, topic)
};

class Topic {
  constructor(data) {
    extendObservable(this, data); // 实时监听数据变化，更新组件
  }

  @observable syncing = false; // 异步请求时对应的做一些处理

  @observable createdReplies = [];

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((resp) => {
          if (resp.success) {
            this.createdReplies.push(createReply({
              id: resp.reply_id,
              content,
              create_at: Date.now(),
            }));
            resolve();
          } else {
            reject(resp);
          }
        }).catch(reject);
    });
  }
}

export default class TopicStore {
  @observable topics;

  @observable syncing;

  @observable details;

  @observable createdTopics = [];

  @observable tab;

  constructor({
    topics = [],
    syncing = false,
    details = [],
    tab = null,
  } = {}) {
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(topic => new Topic(createTopic(topic)));
    this.syncing = syncing;
    this.tab = tab;
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail;
      return result;
    }, {});
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length) {
        resolve();
      } else {
        this.tab = tab;
        this.syncing = true;
        this.topics = [];
        get('/topics', {
          mdrender: false, // 是否把markdown语法转换为html， 不转换为了好编辑markdown
          tab,
        }).then((resp) => {
          if (resp.success) {
            this.topics = resp.data.map((topic) => {
              return new Topic(createTopic(topic));
            });
            resolve();
          } else {
            reject();
          }
          this.syncing = false;
        }).catch((err) => {
          reject(err);
          this.syncing = false;
        });
      }
    });
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap);
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data));
            this.details.push(topic);
            resolve(topic);
          } else {
            reject();
          }
        }).catch(reject);
      }
    });
  }

  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
      }, {
        title, tab, content,
      }).then((resp) => {
        if (resp.success) {
          const topic = {
            title,
            tab,
            content,
            id: resp.topic_id,
            create_at: Date.now(),
          };
          this.createdTopics.push(new Topic(topic));
          resolve();
        } else {
          reject();
        }
      }).catch(reject);
    });
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: this.syncing,
      details: toJS(this.details),
      tab: this.tab,
    };
  }
}
