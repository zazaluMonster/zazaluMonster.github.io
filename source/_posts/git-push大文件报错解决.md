---
title: git push大文件报错解决
tags: Bugs
categories: IT
date: 2019-06-08 12:21:27
---

# 错误描述

git push无法上传超过100MB的文件（50MB会警告），错误log如下(部分敏感信息做了隐藏)
```s
Counting objects: 4, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 123.34 MiB | 1.83 MiB/s, done.
Total 4 (delta 0), reused 0 (delta 0)
remote: error: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: error: Trace: 19e4cebc572e034bbb9c98400b094323
remote: error: See http://git.io/iEPt8g for more information.
remote: error: ***.pdf is 127.70 MB; this exceeds GitHub's file size limit of 100.00 MB
To https://github.com/***/***.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://github.com/***/***.git'
```

# 解决方法

1. 使用git log查看所有的提交节点commit_id,我的如下
```s
commit be7dafc20357142ff529f6d397a8452d4084a84b (HEAD -> master)
Author: zazaluMonster <hejiajun1432@gmail.com>
Date:   Sat Jun 8 12:14:28 2019 +0800

    test大文件提交push失败回滚

commit 59083eafa73f4a1c36d31eb7dad1385017b92339 (origin/master)
Author: zazaluMonster <hejiajun1432@gmail.com>
Date:   Sat Jun 8 12:12:14 2019 +0800

    update

commit 2c7793bacdd323cf4c0f91eefd8950980c402602
Author: zazaluMonster <hejiajun1432@gmail.com>
Date:   Thu Jun 6 16:37:41 2019 +0800

    update

# ...其余信息省略
```

2. 筛选你想要的回退到的commit节点，比如我回退到59083eafa73f4a1c36d31eb7dad1385017b92339

3. 使用`git reset <commit_id>`进行回退。注意不要使用`git reset HEAD <commit_id>`这会导致你的工作区也回退到相应的节点，这样的话你会发现刚写的东西就没了（可以补救，也就是在使用reset回退到最新的commit节点）

4. 使用`git status`你会发现一切都重新从你修改本地文件之后，add之前开始了
