<template>
  <div id='overlay' v-on:click='closeModal'>
      <div id='content' v-on:click='stopEvent'>
        <p>this is modal</p>
      </div>
  </div>
</template>

<script>

export default{
  name: 'chartModal',
  date(){
    return{}
  },
  methods:{
    closeModal(){
      /*ここからモーダル閉める指示 */
      this.$emit('close-modal')
    },
    stopEvent(){
      event.stopPropagation()
    }
  }

}
</script>

<style scoped>

#overlay{
  z-index:1;

  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(100, 100, 100, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  border-color: #ffffff;
  border-width: 2px;
  z-index:2;
  min-width:40%;
  height:50%;
  padding: 1em;
  background: rgba(255, 255, 255, 0.8);
}
</style>