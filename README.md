### 写在前面：

> 易搜题小程序虽已上线，但由于团队新学期每个人都有自己的小目标，因此决定已停止更新该项目，感谢团队成员吴同学和蓝同学的努力付出，我们作为开发小白的我们在这个项目中都学到了很多。为了记录人生中第一个开发，我将该作品的概要说明发布在此。

------

>#### 作品名称：易搜题                       
>#### 联系人姓名与E-mail: 刘* 1020341630@qq.com
>#### Github: https://github.com/TragedyN/i_search

------

### 一、作品简介

> **易搜题**是一款面向大学生的**智能学习小程序**，主要利用**文字识别算法**实现单词查询，搜题解答的功能，并且满足用户**在线互助**解题和学习交流的需求，帮助大学生们获得更好的学习体验。

### 二、主要界面
#### 1．小程序主页：
> 两个功能，一是调用拍照或者上传图片，二是通过文本框输入实现**单词**，**题目**，**知识点**文本搜索，其中单词搜索有调用第三方api。作为主页，界面简洁，功能实用是最大的优点。
![home](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e4%b8%bb%e9%a1%b5.png)
#### 2.在线互助界面：
> 基本功能为：**提问**，**评论**，查看具体问题和图片，提问数量多可以下滑，加号具有快速提问功能，并且每个问题都带有科目标签，帮助用户更精确的了解问题。
![live](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e4%ba%92%e5%8a%a9%e4%b8%ad%e5%bf%83.png)
#### 3.个人中心界面:
> 基本功能为：用户登入获得用户信息，用户可以查看搜题历史和收藏过的题目，用户可以查看自己在在线平台提的问题和收到的回答。
![self](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e4%b8%aa%e4%ba%ba%e4%b8%ad%e5%bf%83.png)
#### 4.其他页面：
>![a](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e6%8b%8d%e7%85%a7%e6%90%9c%e7%b4%a2%e7%bb%93%e6%9e%9c.png)
![b](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e5%88%86%e4%ba%ab%e6%90%9c%e9%a2%98%e7%bb%93%e6%9e%9c.png)
![c](https://www.cnblogs.com/images/cnblogs_com/peacepeacepeace/1402636/o_%e6%8f%90%e5%87%ba%e9%97%ae%e9%a2%98.png)
### 三、创新要点

> 在技术创新方面，易搜题利用到的文字识别算法，将当前最新的目标检测技术YOLOV3和CRNN完美融合在一起，通过特定数据集的训练能较好的对中文自然场景的文本进行检测与识别，根据自己服务器的环境微调后，算法对CPU环境的支持也更加到位，在保证精确度的同时也提高了识别速度。
在市场应用创新方面，当前应用市场上存在的拍照识别搜题软件对象基本为中小学生，而易搜题的用户对象是广大的在校大学生，我们会制定专门的大学生科目题库为大学生提供解题服务，并且提供在线平台供用户们提问和回答。此外，易搜题以小程序的形式存在会更加容易分享和推广。

### 四、开发环境
> 小程序编程：微信web开发工具 算法：单核2GCPU服务器 Anaconda+Flask+phpMyAdmin

### 五、结语

> 给我们感触最深的是每个人都要有一种奉献精神，因为大三了大家都很忙，但是我们每个人都会抽空为这个项目添砖加瓦，都会互相催促进度，前端太忙后端帮忙做一下，后端太忙算法帮忙补一下，这个经历是我们之前都没有体验过的，让我们都学到了很多。还是感到很幸运我们能在同一组一起做喜欢的东西。希望有一天真的有这种应用的出世，让“易搜题们”造福广大大学生。