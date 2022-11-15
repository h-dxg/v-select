<script>
import scroll from './scroll.js';
import refs from './index.js';

//大数据虚拟加载下拉框
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 参数过滤
    filterProps: {
      type: Object,
      default: function() {
        return {
          key:'key',
          value:'value'
        };
      }
    },
    // 下拉框数组
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否启用虚拟滚动
    isVdom:{
       type: Boolean,
        default: function() {
        return false
      }
    },
    value:{
        default: null
    }
  },

  data () {
    return {
      KeyValue:{
        key:'',
        value:''
      },//下拉框显示的内容
      expand:true, //箭头
      isTocuh:false, // 是否点击
      vscroll:null //抽象虚拟滚动对象
    }
  },
  watch:{
      value(newValue){
        // 如果此时双向绑定的值有默认值，需要回显下拉框内容
        if(newValue){
           this.KeyValue.key = refs.filter(newValue)
        }
      },
     'KeyValue.value':{
      handler (newValue, oldValue) {
        this.$emit('change', newValue)
      },
      deep: true, // 对象内部的属性监听，也叫深度监听
      immediate: true // 立即监听
    }
  },
  computed: {
    // 数据更新
        dataList() {
            return refs.init(this.options,this.filterProps);
        }
    },

  // 同步实例状态
  created () {
  },
  mounted() {
     console.log( this.options,' this.options')
  },
  destroy () {

  },
  methods:{
    // 点击小箭头 开始加载数据
    handleClickExpand (){
      this.expand = !this.expand;
     //启用虚拟滚动
        if(this.isVdom){
          if(this.expand){
            // 每次点击需要重新销毁生成新的抽象class
            this.vscroll.destroy(document.getElementById('container'))
          }else{
            this.vscroll=new scroll.Refaa(
                {
                  el: document.getElementById('container'),
                  liHeight: 40, //每一行行数据高度，
                  data: this.dataList,
                }
              )
            this.vscroll.init()
        }
       }
      
    },
    blur (){
       this.isTocuh = false 
    },
    focus (){
       this.isTocuh = true 
    },
    onClick(event){
      this.KeyValue.key=event.target.innerHTML
      this.KeyValue.value=event.target.value
    },
    vDomScroll(){
      // 只有启动虚拟滚动时候生效
     if (this.isVdom) {
        this.KeyValue.key=this.vscroll.key
        this.KeyValue.value=this.vscroll.value
     }
      
    }
  },
  render (h) {
    return (
      <div class="select"  onClick={this.handleClickExpand}>
        <input style='border-radius: 3px;' value={this.KeyValue.key}  type="text" readonly="readonly" autocomplete="off" onBlur={this.blur} onFocus={this.focus} placeholder="请选择" class={[this.isTocuh ?'select_selected ':'select_select']} />
        <span class='arrowBox'>
          <span class={[this.expand ? 'arrow' : 'down']} ></span>
        </span>
        <div class='options' style={{display: this.expand ? 'none' : 'block'}}>
          <ul class='ul_ul'  id="container"  onClick={this.vDomScroll}>
              {/*	少量数据时直接使用jsx循环即可,启动虚拟滚动时自动隐藏*/}
              <div   style={{display: this.isVdom ? 'none' : 'block'}}>
                {
                  this.dataList.map((item,index)=>{
                    return <li class='ul_li' key={index} value={item.value}  onClick={this.onClick} >{item.key}</li>
                  })
                }
              </div>
          </ul>
        </div>
      </div>
    )
  }
}

</script>
<style scoped>
::-webkit-scrollbar-track-piece {
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(#bbb, #bbb, #bbb, 0.3);
}
.select {
  width: 240px;
  position: relative;
  height: 40px;
}
.select_select {
  cursor: pointer;
  width: 240px;
  height: 40px; /* 40/16 */
  border: 1px solid #dcdfe6;
  color: #606266;
  outline: none;
  font-weight: 400;
  padding-right: 20px;
  padding-left: 10px;
}
.select_selected {
  cursor: pointer;
  width: 240px;
  color: #606266;
  height: 40px; /* 40/16 */
  border: 1px solid #dcdfe6;
  outline: 1px solid #409eff;
  font-weight: 400;
  padding-right: 20px;
  padding-left: 10px;
}
.arrowBox {
  cursor: pointer;
  display: block;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 20px;
  height: 100%;
}
.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  right: 4px;
  top: 35%;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
  transform: rotate(-135deg);
  transition: all 0.3s;
}
.down {
  position: absolute;
  width: 8px;
  height: 8px;
  right: 0px;
  top: 45%;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
  transform: rotate(45deg);
  transition: all 0.3s;
}
.options {
  border-radius: 2px;
  margin-top: 10px;
  width: 260px;
  height: 280px;
  padding: 5px;
  box-shadow: 1px 1px 1px 1px #dddada;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.ul_ul {
  height: 100%;
  overflow-y: scroll;
  cursor: pointer;
}
.ul_li {
  width: 100%;
  height: 40px;
  color: #606266;
  text-align: center;
  line-height: 40px;
}
.ul_li:hover {
  background-color: #f5f7fa;
}
.totalBox {
  width: 100%;
  /* background-color: pink; */
}
.listBox {
  border: 1px solid blue;
  height: 600px;
  box-sizing: content-box;
  width: 100%;
}
</style>
