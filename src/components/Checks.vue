<template>
  <div>
    <div class="row">
      <h4 v-b-toggle.checks class="checks">
        More Checks
      </h4>
    </div>
    <b-collapse id="checks">
      <div class="row">
        <div class="custom-control custom-switch">
          <input 
            type="checkbox" 
            class="custom-control-input" 
            id="contractionSwitch" 
            @change="flipContractions()"
          >
          <label class="custom-control-label" for="contractionSwitch">
            <h5>
              Contractions
            </h5>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="custom-control custom-switch">
          <input 
            type="checkbox" 
            class="custom-control-input" 
            id="lyWordsSwitch" 
            @change="flipLyWords()"
          >
          <label class="custom-control-label" for="lyWordsSwitch">
            <h5>
              "-ly" Words
            </h5>
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
      highlightContractions: false,
      highlightLyWords: false
    }
  },
  methods: {
    flipContractions() {
      this.highlightContractions = !this.highlightContractions
      this.$emit('checkContent');
    },
    flipLyWords() {
      this.highlightLyWords = !this.highlightLyWords
      this.$emit('checkContent');
    }
  }
}
</script>

<style>
  .checks:hover {
    text-decoration: underline;
  }
  .custom-control-input:checked ~ .custom-control-label::before { 
    border-color: #ffc107 !important;
    background-color: #ffc107 !important;
  }
</style>
