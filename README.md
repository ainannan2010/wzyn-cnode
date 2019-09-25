# wzyn-cnode
like a cnode

## git change commiter
https://www.it610.com/article/3239369.htm
step0>>>
git clone --bare https://github.com/xxx/xxx.git
cd xxx.git

#### !/bin/sh
step1>>>

git filter-branch --env-filter '

OLD_EMAIL="xxx.com"
CORRECT_NAME="Young"
CORRECT_EMAIL="18747201451@example.com"

# 可以通过或关系重写多个用户名
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

step2>>>
git push --force --tags origin 'refs/heads/*'

step3>>>
清除临时 clone。
cd ..
rm -rf repo.git
