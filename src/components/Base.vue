<template>
  <div>
    <div class="pt-4 pb-3 pl-4">
      <h3>Write Concise</h3> 
      <h5 class="text-info"><span class="modal-btn" v-b-modal.modal-1>About</span></h5>
    </div>
    <div class="row justify-content-between">
      <div class="col-md-8 col-lg-7 mb-5">
        <div class="hashtag-textarea">
          <div 
            id="input-overlay"
            class="overlay"
            >Write Concise is a tool to help you write better by writing less. 
            Entering words or phrases under "Highlight" makes it easy to remove or replace them in the text.
            <br><br>Click "Examples" to try it.
            <br><br>It is a nice thing to write very concisely.
            A number of important people think concise writing is pretty great.
            I believe Write Concise will definitely improve your writing.
          </div>
          <div id="good-input" 
              class="true-text"
              wrap="soft"
              contenteditable="true"
              spellcheck="false"
              placeholder="Write or paste something to get started..."
              oninput="if(this.innerHTML.trim()==='<br>')this.innerHTML=''"
              autofocus="autofocus">Write Concise is a tool to help you write better by writing less. 
            Entering words or phrases under "Highlight" makes it easy to remove or replace them in the text.
            <br><br>Click "Examples" to try it.
            <br><br>It is a nice thing to write very concisely.
            A number of important people think concise writing is pretty great.
            I believe Write Concise will definitely improve your writing.
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-3 pl-5 pt-4 pr-5 pl-md-0 pt-md-0">
        <highlight ref="highlight" @keywordChange="replaceContent" />
        <uncommon :wordArray="wordArray" class="pb-3" />
        <word-count :wordArray="wordArray" />       
      </div>
    </div>
    <div class="row"><br><br></div>
    <div>
      <b-modal id="modal-1" title="What is Write Concise?" hide-footer>
        <p>Write Concise is a tool to help you write better by writing less based on my editing workflow.</p> 
        <p>Wondering why and how to write concisely? Read these:</p>
        <ul>
          <li><a href="https://www.orwell.ru/library/essays/politics/english/e_polit/" class="text-info" target="_blank" rel="noopener">Politics and the English Language by George Orwell</a></li>
          <li><a href="https://dilbertblog.typepad.com/the_dilbert_blog/2007/06/the_day_you_bec.html" class="text-info" target="_blank" rel="noopener">The Day You Became A Better Writer by Scott Adams</a></li>
          <li><a href="http://paulgraham.com/writing44.html" class="text-info" target="_blank" rel="noopener">Writing, Briefly by Paul Graham</a></li>
        </ul>
        <p>Write Concise is made by <a href="https://ianvanagas.com/" target="_blank" rel="noopener" class="text-info">Ian Vanagas</a></p>
        <p>Any feedback or issues? <a href="mailto:ianvanagas@gmail.com" class="text-info" target="_blank" rel="noopener">Send me an email.</a></p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Uncommon from './Uncommon.vue';
import WordCount from './WordCount.vue';
import Highlight from './Highlight.vue';

export default {
  components: {
    Highlight,
    Uncommon,
    WordCount
  },
  data () {
    return {
      wordArray: []
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
    this.replaceContent()
    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
        this.replaceContent
    });
    window.onbeforeunload = function() {
        return "Leaving this page will reset it";
    };
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

      // NOTE: Trim line break code (except Safari browser)
      const spaceExp = /^\n\n/gm
      const content2 = content.replace(spaceExp, function() {
        return '\n'
      })
      // NOTE: Create new text content
      const srcContent = this.isSafariBrowser ? content : content2

      this.wordArray = srcContent.split(' ')

      if (this.$refs.highlight.keywordList.length) {
        var joinedKeywords = this.$refs.highlight.keywordList.join('\\b|\\b')
        joinedKeywords = '\\b' + joinedKeywords + '\\b'
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

<style scoped>
  .hashtag-textarea {
    position: relative;
    overflow: auto;
    background: white;
    min-height: 200px;
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

  .modal-btn:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .modal-btn:focus {
     outline: 0;
  }
</style>
