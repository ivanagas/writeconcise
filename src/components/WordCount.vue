<template>
  <div>
    <div class="row">
      <h4 role="button" :aria-expanded="open" @click="open = !open" class="word-count">Word Count</h4>
    </div>
      <div v-show="open" id="word-count">
        <div class="row">
          <h5>
            Total: <span class="text-info">{{wordCount}}</span>
          </h5> 
        </div>
        <div class="row">
          <h5>
            Highlighted: <span class="text-info">{{highlightedWordCount}}</span>
          </h5> 
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['wordArray', 'highlightedWordCount'],
  data () {
    return {
      open: false,
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
