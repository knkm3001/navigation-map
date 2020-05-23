<template>
  <div id='nav-container' @click="$emit('multiHundler', 'changeRoutingModalState')">
    <div id='nav' v-on:click='stopEvent'>
      <ul>
        <li><a href='#' @click="$emit('multiHundler', 'changeMapOption')">change map option</a></li>
        <li><a href='#' @click="$emit('multiHundler', 'changeRoutingModalState')">show routing table</a></li>
        <li><a href='#' @click="$emit('multiHundler', 'clearAll')">clear all lines</a></li>
        <li class='github'>
          <a href='https://github.com/knkm3001/navigation-map' target=�_blank�>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          github</a>
        </li>
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

.github{
  bottom:0px;
}

</style>>