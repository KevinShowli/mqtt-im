# mqtt im 

## subTopic 订阅

客户端在初始化时订阅：

**im/+/+/userId/+/#**

+ 第一个‘**+**’  代表消息方式，类型：

  + p --- 单播
  + g --- 组播
  + b --- 广播

+ 第二个‘**+**’  代表发送方，即，from

  当第一个‘**+**’为：

  + p 时，from为：发送方id
  + g 时，from为：groupId
  + b 时，from为：服务端定义字段，如：sys

+ **userId**  账户ID，全局唯一。

+ 第三个‘**+**’  代表消息父类型:

  + imMsg  (通讯消息)
  + inviteMsg  (邀请消息)

+ **#**  统配消息具体子类型：

  + imMsg
    + text ---- 文本
    + img  ---- 图片
    + video ---- 视频
    + voice  ----  音频
    + file ----  文件
  + inviteMsg
    + add
    + group

## 客户端 send Message

+ MQTT消息对象：**msgObj**

​          **{type: 'text'/'img'/'file'/'voice'/'video'/'add'/'group', val:''}**

+ **msgObj.destinationName**
  + im/+/userA/userB/+/#









