<template>
    <div>
      <div class="row">
        <h4>Highlight</h4>
      </div>
      <div class="row">
        <h5 class="hightlight-btn"><span class="text-info" @click="exampleWords">Examples</span> <span v-show="keywordList.length" class="text-danger" @click="clear">Clear</span></h5>
      </div>
      <div class='mb-3'>
        <div class="row">
          <input type='text' 
                  placeholder="Enter a word or phrase" 
                  class='keyword-input__text p-2' 
                  @keydown.enter='addKeyword' 
                  @keydown.188='addKeyword'
                  @blur='addKeyword'
          />
        </div>
        <div class="row">
          <div v-for='(inputKeyword, index) in keywordList' :key='inputKeyword' class='keyword-input__keyword float-left mr-2 mb-1 rounded'>
              <span @click='removeKeyword(index)'>x</span>
              {{ inputKeyword }}
          </div>
        </div>
      </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
          keywordList: []
        }
    },
  created() {
    const cookies = document.cookie.split('; ')
    cookies.forEach(item => {
      if (item.includes('keywordList')) {
        const preKeywords = item.replace('keywordList=','');
        if (preKeywords) {
          this.keywordList = this.keywordList.concat(preKeywords.split(','))
        }
      }
    })

  },
  methods: {
    addKeyword () {
      event.preventDefault();
      const val = event.target.value.trim();    
      if (val.length > 0) {
        if (val.includes(", ")) {
          const big = val.split(', ');
          this.keywordList = big.concat(this.keywordList)
        } else {
          if (!this.keywordList.includes(val.toLowerCase())) {
            this.keywordList.unshift(val.toLowerCase());
          }
        }
        event.target.value = '';
        this.$emit('keywordChange');
        document.cookie = "keywordList=" + this.keywordList
      }
    },
    removeKeyword (index) {
      this.keywordList.splice(index, 1);
      this.$emit('keywordChange');
      document.cookie = "keywordList=" + this.keywordList;
    },
    clear () {
      this.keywordList = [];
      this.$emit('keywordChange');
      document.cookie = "keywordList=" + this.keywordList;
    },
    exampleWords () {
      const exWords = ["just", "that", "already", "actual", "think", "pretty", "really", "great", "got", "around", " very ", "thing", "much", "fortunate", "nice", "will", "being", "has", "been", "own", "more", "have", "a little", "in order", "a number of", "who are", "who is", "definitely", "important", "able", "look to", "in the future", "would", "could", "without any", "i believe", "it seems"];
        for (let i=0; i < this.keywordList.length; i++) {
          const dupIndex = exWords.indexOf(this.keywordList[i])
          if (dupIndex > -1) {
            exWords.splice(dupIndex, 1);
          }
        }
      this.keywordList = this.keywordList.concat(exWords)
      this.$emit('keywordChange');
      document.cookie = "keywordList=" + this.keywordList;
    }    
  }
}
</script>

<style scoped>

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
