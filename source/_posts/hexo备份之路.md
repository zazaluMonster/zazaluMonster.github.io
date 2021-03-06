---
title: hexo备份之路
tags: hexo
categories: IT
date: 2019-04-25 11:21:26
---

前阵子，我的hexo博客丢失源文件，吃了没有备份的源文件的苦头，所以现在我的hexo博客已经加上了备份机制，使其更加健壮了，本文将记录如何方便的进行hexo备份

适用hexo版本 4.x
查阅此文档前，您必须保证您已经阅读完毕hexo的官方文档，并且已经实际操作过，不然阅读以下的文字会让你理解上有点困难

## hexo备份步骤

1. 在一个新的文件夹(A文件夹)内使用git去clone你的github上的远程hexo库(yourgitname.github.io)，完成后A文件夹内会出现一个clone后的git库文件夹(yourgitname.github.io),点击进入后，里面是hexo用于生成网页的文件结构，而非hexo本地源文件。

2. 打开浏览器，进入自己的github，为自己的远程hexo库建立一个分支，最好名为hexo，并将其设为默认分支（方便我们后续提交）。随后我们需要在这个分支内创建一个.gitignore文件。因为新版本hexo在执行`hexo init`等一系列建站脚本后，会在本地已经为你创建了一个.gitignore文件了，其文件内容就是我们想要的，将其内容复制到刚刚我们新创建的.gitignore文件内并上传至hexo分支即可（如何创建分支自行百度）

3. hexo分支准备完成后，我们就可以在我们cmd界面使用`git checkout  hexo`将分支切到hexo分支，然后将我们的hexo源文件复制到这里，复制完成后将这些文件一并上传至远程hexo分支即可。到此就完成了hexo备份。现在我们就可以在本地的hexo分支环境下直接写新文章，写完后上传hexo分支，最后使用`hexo d`，让hexo脚本自动将生成后的文件上传至master分支。最后github上的hexo库的2个分支就完美的呈现它们的价值了，hexo分支内可以看到我们的本地源文件，master分支上就保存着`hexo d`对应的那些文件用于直接排版我们的网页

4. 以防万一，我们最好在本地也对我们的源文件进行归档备份

## 后续每次写完新文章后需要执行的shell指令

1. git add <newfile>
2. git commit -m "备份"
3. git push origin hexo
4. hexo g
5. hexo d

## 加入gitee后的新增操作指令 2019.9.24

我目前把自己的博客在gitee pages上也弄了一份，目的是为了借助下gitee在国内访问比较快的优点。

所以现在要额外备份gitee的版本

如果是新的机子,按顺序做如下操作即可

1. 安装git和hexo
2. git init  +  git remote add origin 'github repo url' + git remote add gitee 'gitee repo url'
3. git pull origin hexo 把hexo文件全部拉取过来

到这里为止我估计环境就ok了，那么每次写完新文章如果想顺便做备份的话，其shell指令就如下:

1. git add <newfile>
2. git commit -m "backup"
3. - git push origin hexo
   - git push gitee hexo
4. hexo g
5. hexo d
6. node ./comment.js #用于自动化初始化gitalk的issue，不一定每次都要执行