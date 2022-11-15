<template>
  <div id="app">
    <span @click="add"> 下拉框的值是这个:{{value}}</span>
    <br /> <br />
    <my-select
      v-model="value"
      :options='options'
      :filterProps='filterProps'
      :isVdom='isVdom'
    />

  </div>
</template>

<script>
import MySelect from '@/components/MySelect/select'


export default {
  name: 'App',
  data () {
    return {
      value:'',
      isVdom:false, // 是否开启虚拟滚动下拉
      filterProps:{
        key:'text',
        value:'value'
      },
      options: [
      ]
    }
  },
  components: {
    MySelect
  },
  created() {
       // 模拟数据生成
        let p = new Promise((resolve, reject) => {
          let t = 100 // 需要加载的海量数据 建议开启虚拟滚动后写入上万数据，不开启会卡顿
          let data = []
          for (let i = 0; i < t; i++) {
            data.push({
              text:`我是生成的${i + 1}条数据`,
              value:i+1
            })
          }
          resolve(data)
        })
        p.then((res) => {
          this.options=res
          console.log(this.options)
        
        })
  },
  methods: {
    add(){
      this.value++
    }
  },
}
</script>

<style>
@import './assets/reset.css' #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
