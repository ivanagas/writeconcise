<template>
    <div>
      <div class="row">
        <h4 v-b-toggle.highlight class="highlight">
          Highlight
        </h4>
      </div>
      <b-collapse visible id="highlight">
        <div class="row">
          <h5 class="hightlight-btn">
            <span class="text-info" @click="exampleWords">Try It</span>&nbsp;
            <span 
              v-show="keywordList.length"
              class="text-danger" 
              @click="clear"
            >
              Clear
            </span>
            <span 
              v-show="undoList.length && !keywordList.length"
              class="text-info" 
              @click="undo"
            >
              Undo
            </span>
          </h5>
        </div>
        <div class='mb-3'>
          <div class="row">
            <input 
              type='text' 
              placeholder="Enter a word or phrase" 
              class='keyword-input__text p-2' 
              @keydown.enter='addKeyword' 
              @keydown.188='addKeyword'
              @blur='addKeyword'
            />
          </div>
          <div v-if="warning" class="row mt-3">
            <b-alert class="w-100 mb-2 mr-4 alert-danger" show dismissible @dismissed="clearWarning">
              {{ warning }}
            </b-alert>
          </div>
          <div class="row">
            <div 
              v-for='(inputKeyword, index) in keywordList' 
              :key='inputKeyword' 
              class='keyword-input__keyword float-left mr-2 mb-1 rounded'
            >
              <span @click='removeKeyword(index)'>x</span>
              {{ inputKeyword }}
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
</template>

<script>
import EventBus from './eventbus.js'

export default {
  data () {
    return {
      keywordList: [],
      warning: '',
      undoList: []
    }
  },
  created() {
    const storedKeywords = window.localStorage.getItem('keywordList');
    if (storedKeywords) {
      this.keywordList = storedKeywords.split(',');
    }
  },
  mounted() {
    EventBus.$on('highlight', word => {
      this.addCleanKeyword(word);
    });
  },
  methods: {
    addKeyword () {
      event.preventDefault();
      const val = event.target.value.trim();
      if (val.length > 0) {
        if (val.includes(", ")) {
          const cleanVals = val.split(', ');
          this.keywordList = cleanVals.concat(this.keywordList)
        } else {
          if (!this.keywordList.includes(val.toLowerCase())) {
            this.keywordList.unshift(val.toLowerCase());
            if (val.length > 20) {
              this.warning = "That's a long keyword to highlight. Did you mean to add it to the editor?"
            }
          }
        }
        event.target.value = '';
        this.$emit('keywordChange');
        window.localStorage.setItem('keywordList', this.keywordList);
        if (!window.location.href.includes('localhost:8080')) {
          this.$posthog.capture('keyword added', { word: val.toLowerCase() })
        }
      }
    },
    addCleanKeyword(word) {
      if (!this.keywordList.includes(word)) {
        this.keywordList.unshift(word);
        this.$emit('keywordChange');
        window.localStorage.setItem('keywordList', this.keywordList);
      }
    },
    removeKeyword(index) {
      this.keywordList.splice(index, 1);
      this.$emit('keywordChange');
      window.localStorage.setItem('keywordList', this.keywordList);
    },
    clear() {
      this.undoList = this.keywordList;
      this.keywordList = [];
      this.$emit('keywordChange');
      window.localStorage.setItem('keywordList', this.keywordList);
    },
    exampleWords() {
      const exWords = ["just", "that", "already", "actual", "think", "pretty", "really", "great", "got", "around", "very", "thing", "much", "fortunate", "nice", "will", "being", "has", "been", "own", "more", "have", "a little", "in order", "a number of", "who are", "who is", "definitely", "important", "able", "look to", "in the future", "would", "could", "without any", "i believe", "it seems"];
      for (let i=0; i < this.keywordList.length; i++) {
        const dupIndex = exWords.indexOf(this.keywordList[i])
        if (dupIndex > -1) {
          exWords.splice(dupIndex, 1);
        }
      }
      this.keywordList = this.keywordList.concat(exWords)
      this.$emit('keywordChange');
      window.localStorage.setItem('keywordList', this.keywordList);
    },
    clearWarning() {
      this.warning = ''
    },
    undo() {
      this.keywordList = this.undoList;
      this.undoList = [];
      this.$emit('keywordChange');
      window.localStorage.setItem('keywordList', this.keywordList);
    }
  }
}
</script>

<style scoped>
  .highlight:hover {
    text-decoration: underline;
  }

  .keyword-input__keyword {
    height: 100%;
    background-color: #eee;
    margin-top: 10px;
    font-family: "Helvetica", sans-serif;
    font-size: 20px;
    line-height: 1.3;
    padding: 0 5px;
  }
  .keyword-input__keyword > span {
    cursor: pointer;
  }
  .keyword-input__text {
    border: 2px solid #17a2b8;
    border-radius: 5px;
    outline: none;
    font-family: "Helvetica", sans-serif;
    font-size: 20px;
    line-height: 1.3;
    background: none;
  }

  .hightlight-btn {
    cursor: pointer;
  }
  .hightlight-btn > span:hover {
    text-decoration: underline;
  }
</style>
