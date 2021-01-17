<template>
  <div>
    <div class="pt-3 pb-4 pl-4">
      <h3>Shorter Letter</h3> 
      <h5>Write With Better Words - Help</h5>
    </div>
    <div class="row justify-content-between">
      <div class="col-7">
        <div class="hashtag-textarea">
          <div 
            id="input-overlay"
            class="overlay"
            />
          <div id="good-input" 
              class="true-text"
              wrap="soft"
              contenteditable="true"
              spellcheck="false"
              placeholder="Start writing..."
              oninput="if(this.innerHTML.trim()==='<br>')this.innerHTML=''">
          </div>
        </div>
      </div>
      <div class="col-3">
        <words ref="words" @keywordChange="replaceContent"></words>
      </div>
    </div>
    <div class="footer fixed-bottom p-2">
        <h5 class="float-right"><a href="https://twitter.com/IanVanagas" class="text-muted">Made by Ian Vanagas</a></h5>
    </div>
  </div>
</template>

https://medium.com/js-dojo/hashtag-highlight-textarea-byvue-js-without-draft-js-from-facebook-3ce739b14c4b
https://github.com/mitsuyacider/vue-hashtag-textarea/blob/master/src/vue-hashtag-textarea.vue

<script>
import Words from './Words.vue'

export default {
  components: {
    Words
  },
  data() {
    return {
      input: '',
      output: '',
      swag: '',
      yoshi: '',
    }
  },
  mounted() {
    const target = document.getElementById('good-input');
    const observer = new MutationObserver(this.onObserveElement);
    const config = { 
                    childList: true, 
                    characterData: true,
                    characterDataOldValue: true,
                    subtree: true
                  };
    observer.observe(target, config);

    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
        this.replaceContent
    });
  },
  methods: {
    onObserveElement(mutations) {
      mutations.forEach((mutation) => {
        const type = mutation.type
        switch(type) {
          // NOTE: on change of any text input
          case 'characterData':
            this.replaceContent()
            break;
          
          // NOTE: Line break is occured
          case 'childList':
            this.replaceContent()
            break;

          default:
            break;        
        }
      })
    },
    replaceContent() {
      const target = document.getElementById('good-input');

      // NOTE: Escape html characters
      const content = this.escapeHtml(target.innerText)
      // const contentHTML = target.textContent

      // NOTE: Trim line break code (except Safari browser)
      const spaceExp = /^\n\n/gm
      const content2 = content.replace(spaceExp, function() {
        return '\n'
      })
      // NOTE: Create new text content
      const srcContent = this.isSafariBrowser ? content : content2

      if (this.$refs.words.keywordList.length) {
        var joinedKeywords = this.$refs.words.keywordList.join('|')
        console.log(joinedKeywords)
        var keywordRegex = new RegExp(joinedKeywords, 'gi')
      }

      // NOTE: Enclose hashtag by <i> tag
      const replaceContent = srcContent.replace(keywordRegex, function(match) {
        const result = '<span class="text-danger border-bottom border-danger">' + match + '</span>'
        return result
      })
      const insertNode = document.getElementById('input-overlay')
      insertNode.innerHTML = replaceContent
    },
    escapeHtml(content) {
      const escapeHashMap = {
        "&": "&amp;",
        "\"": "&quot;",
        "<": "&lt;",
        ">": "&gt;"
      };
      return content.replace(/[&"<>]/g, function(match) {
        return escapeHashMap[match];
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .hashtag-textarea {
    position: relative;
    overflow: auto;
    background: white;
    min-height: 500px;
    height: 100%;
    width: 100%;
    font-family: "Helvetica", sans-serif;
    font-size: 20px;
    line-height: 1.3;
  }

  .true-text {
    border: 0;
    background: transparent;
    position: absolute;
    top: 0;
    color: transparent;
    caret-color: black;
    outline: none;
    padding: 0 23px;
    margin: 0px;
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }    
  .overlay {
    -webkit-tap-highlight-color: transparent;
    padding: 0 23px;
    margin: 0px;
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word; 
  }
  [contenteditable][placeholder]:empty:before {
    content: attr(placeholder);
    position: absolute; 
    color: gray;
    background-color: transparent;
  }
</style>
