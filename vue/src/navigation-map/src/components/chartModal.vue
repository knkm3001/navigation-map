  <template>
  <div id='overlay' :click='closeModal'>
      <div id='content' :click='stopEvent'>
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
  z-index:100;

  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  border-color: #ffffff;
  border-width: 2px;
  z-index:200;
  min-width:40%;
  height:50%;
  padding: 1em;
  background: rgba(99, 97, 97, 0.8);
}
</style>