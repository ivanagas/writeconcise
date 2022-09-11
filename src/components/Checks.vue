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
            v-model="highlightContractions"
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
            v-model="highlightLyWords"
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
  created() {
    // Set settings based on local storage values (converted from strings)
    this.highlightContractions = (window.localStorage.getItem('highlightContractions') === 'true');
    this.highlightLyWords = (window.localStorage.getItem('highlightLyWords') === 'true');
  },
  methods: {
    flipContractions() {
      this.$emit('checkContent');
      window.localStorage.setItem('highlightContractions', this.highlightContractions);
    },
    flipLyWords() {
      this.$emit('checkContent');
      window.localStorage.setItem('highlightLyWords', this.highlightLyWords);
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
