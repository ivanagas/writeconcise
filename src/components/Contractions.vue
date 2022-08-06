<template>
  <div>
    <div class="row">
      <h4 v-b-toggle.contraction class="contraction">
        Contractions
      </h4>
    </div>
    <b-collapse id="contraction">
      <div class="row">
        <div class="custom-control custom-switch">
          <input 
            type="checkbox" 
            class="custom-control-input" 
            id="switch" 
            @change="flipSwitch()"
          >
          <label class="custom-control-label" for="switch">
            Highlight
          </label>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  data () {
    return {
      highlight: false
    }
  },
  methods: {
    flipSwitch() {
      this.highlight = !this.highlight
      this.$emit('checkContractions');
    }
  }
}
</script>

<style>
  .contraction:hover {
    text-decoration: underline;
  }
  .custom-control-input:checked ~ .custom-control-label::before { 
    border-color: #ffc107 !important;
    background-color: #ffc107 !important;
  }
</style>
