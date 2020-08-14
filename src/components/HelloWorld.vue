<template>
  <div>
    <input type="text" v-model="textMsg" @keydown.13="send" />
    <button @click="send">发送</button>
    <el-upload action :before-upload="selectFileImg">
      <el-button size="small" type="primary">图片上传</el-button>
    </el-upload>
    <el-upload action :before-upload="selectFileVoice">
      <el-button size="small" type="primary">音频上传</el-button>
    </el-upload>
    <el-upload action :before-upload="selectFileVideo">
      <el-button size="small" type="primary">视频上传</el-button>
    </el-upload>
    <el-button size="small" type="primary" @click="addFriend"
      >好友邀请</el-button
    >
    <el-button size="small" type="primary" @click="inviteGroup"
      >邀请进群</el-button
    >
    <ul>
      <li v-for="(item, index) in msgList" :key="index">
        <img v-if="item.type == 'img'" :src="item.val" />
        <span v-if="item.type == 'text'">{{ item.val }}</span>
        <audio
          v-if="item.type == 'voice'"
          :src="item.val"
          controls="true"
        ></audio>
        <video
          v-if="item.type == 'video'"
          :src="item.val"
          controls="true"
        ></video>
      </li>
    </ul>
    <el-dialog title="提示" :visible.sync="addVisible" width="30%">
      <span>你收到{{ addUser }}的好友请求，是否同意？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="groupVisible" width="30%">
      <span>你的好友{{ addUser }}邀请你进入{{ group }}，是否同意？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupVisible = false">取 消</el-button>
        <el-button type="primary" @click="groupVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      textMsg: "",
      url: "ws://61.172.240.35:1888/mq",
      clientId: "liukai",
      client: "",
      msgList: [],
      subtopic: "im/+/+/liukai/+/#",
      mytopic: "im/",
      urlBase64: "",
      addVisible: false,
      groupVisible: false,
      addUser: "",
      group: ""
    };
  },
  mounted() {
    this.client = new Paho.MQTT.Client(this.url, this.clientId);
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    let options = {
      // userName: "gmq",
      // password: "1qazxsw2",
      onSuccess: this.onConnect
    };

    this.client.connect(options);
  },
  methods: {
    onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      this.client.subscribe(this.subtopic);
    },
    onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    },
    onMessageArrived(message) {
      console.log(
        "onMessageArrived:[topic]" +
          message.destinationName +
          "\t\t[playload]" +
          message.payloadString
      );
      let topicArr = message.destinationName.split("/");
      let from = topicArr[2];
      let msg = JSON.parse(message.payloadString);
      switch (msg.type) {
        case "add":
          this.addUser = msg.val;
          this.addVisible = true;
          break;
        case "group":
          this.addUser = from;
          this.group = msg.val;
          this.groupVisible = true;
          break;
        default:
          this.msgList.push(msg);
          break;
      }
    },
    sendMessage(msgObj) {
      if (msgObj) {
        let message = new Paho.MQTT.Message(JSON.stringify(msgObj));
        let msgType = "imMsg";
        if (msgObj.type == "add" || msgObj.type == "group") {
          msgType = "inviteMsg";
        }
        message.destinationName = `${this.mytopic}p/liukai/liukai/${msgType}/${msgObj.type}`;
        this.client.send(message);
      }
    },
    send() {
      let msg = {
        type: "text",
        val: this.textMsg
      };
      this.sendMessage(msg);
      this.textMsg = "";
    },
    selectFileImg(file) {
      this.handleFile(file, "img");
    },
    selectFileVoice(file) {
      this.handleFile(file, "voice");
    },
    selectFileVideo(file) {
      this.handleFile(file, "video");
    },
    addFriend() {
      this.sendMessage({
        type: "add",
        val: this.clientId
      });
    },
    inviteGroup() {
      this.sendMessage({
        type: "group",
        val: "信创研发群"
      });
    },
    handleFile(file, type) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.urlBase64 = e.target.result;
        this.sendMessage({
          type,
          val: this.urlBase64
        });
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li img {
  width: 500px;
}
</style>
