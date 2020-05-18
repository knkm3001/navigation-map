<template>
  <div id='nav-container' @click="$emit('multiHundler', 'changeChartModalState')">
    <div id='nav' v-on:click='stopEvent'>
      <ul>
        <li><a href='#' @click="$emit('multiHundler', 'changeMapOption')">change map option</a></li>
        <li><a href='#' @click="$emit('multiHundler', 'changeChartModalState')">show chart table</a></li>
        <li><a href='#'>setting</a></li>
        <li><a href='#' @click="$emit('multiHundler', 'clearAll')">clear all lines</a></li>
      </ul>
    </div>
  </div>
</template>

<script>


export default {
  name: 'HumbergerMenu',
  components:{
  },
  methods:{
    stopEvent(){
      event.stopPropagation()
    }
  }
}


</script>

<style scoped>


#nav-container{
  z-index:4;
  position:fixed;
  top:0;
  right:0;
  width:100%;
  height:100%;
}

ul{
  padding-inline-start:0px;
}

li {
  font-family: 'Noto Sans', sans-serif;
  font-size:1.2em;
  list-style: none;
  margin: 1em;
}

li:hover {
  background:rgba(172, 172, 172, 0.9);
}


a {
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  display: inline-block;
  
}

 
/* メニュー */
#nav {
  background: rgba(150, 151, 151,0.9);
  z-index: 5;
  right: 0;
  position: absolute;
  width: 15\2em;
  height: 100%;
  overflow-x: hidden;
  text-align: center;
  overflow: hidden;
  
}

</style>>