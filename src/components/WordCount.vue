<template>
  <div>
    <div class="row">
      <h4 v-b-toggle.word-count class="word-count">Word Count</h4>
    </div>
      <b-collapse id="word-count">
        <div class="row">
          <h5 class="text-info">{{wordCount}}</h5> 
        </div>
      </b-collapse>
  </div>
</template>

<script>
export default {
  props: ['wordArray'],
  data () {
    return {
      wordCount: 0
    }
  },
  watch: {
    wordArray: function () {
      this.wordCount = this.wordArray.length
    }
  }
}
</script>

<style>
  .word-count:hover {
    text-decoration: underline;
  }
</style>
