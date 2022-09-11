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
            <br><br>Click "Try It" see what it looks like on the example below.
            <br><br>It is a nice thing to write very concisely.
            A number of important people think concise writing is pretty great.
            I believe Write Concise will definitely improve your writing.
          </div>
          <div 
            id="good-input" 
            class="true-text"
            wrap="soft"
            contenteditable="true"
            spellcheck="false"
            placeholder="Write or paste something to get started..."
            oninput="if(this.innerHTML.trim()==='<br>')this.innerHTML=''"
            autofocus="autofocus"
            >Write Concise is a tool to help you write better by writing less. 
            Entering words or phrases under "Highlight" makes it easy to remove or replace them in the text.
            <br><br>Click "Try It" to see what it looks like on the example below.
            <br><br>It is a nice thing to write very concisely.
            A number of important people think concise writing is pretty great.
            I believe Write Concise will definitely improve your writing.
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-3 pl-5 pt-4 pr-5 pl-md-0 pt-md-0">
        <highlight ref="highlight" @keywordChange="replaceContent" />
        <uncommon :wordArray="wordArray" />
        <word-count 
          :wordArray="wordArray"
          :highlightedWordCount="highlightedWordCount"
        />
        <checks ref="checks" @checkContent="replaceContent" />
      </div>
    </div>
    <div class="row"><br><br></div>
    <modal />
  </div>
</template>

<script>
import Uncommon from './Uncommon.vue';
import WordCount from './WordCount.vue';
import Highlight from './Highlight.vue';
import Modal from './Modal.vue';
import Checks from './Checks.vue';

export default {
  components: {
    Highlight,
    Uncommon,
    WordCount,
    Modal,
    Checks
  },
  data () {
    return {
      wordArray: [],
      highlightedWordCount: 0
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
    
    // Listen for pasted content
    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
      this.replaceContent()
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
          // On change of any text input
          case 'characterData':
            this.replaceContent()
            break;
          
          // Line break is occured
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

      // Escape html characters
      const content = this.escapeHtml(target.innerText)

      // Trim line break code (except Safari browser)
      const spaceExp = /^\n\n/gm
      const content2 = content.replace(spaceExp, function() {
        return '\n'
      })
      // Create new text content
      let replaceContent = this.isSafariBrowser ? content : content2

      this.wordArray = replaceContent.split(' ')

      // If highlighting contractions is active
      // Enclose contractions in a yellow underlined <span> tag
      if (this.$refs.checks.highlightContractions) {
        var contractionRegex = new RegExp(/\b\w+('|’)\w+\b/, 'gi')
        replaceContent = replaceContent.replace(contractionRegex, function(match) {
          const result = '<span class="text-warning border-bottom border-warning">' + match + '</span>'
          return result
        })
      }

      // If highlighting "-ly" Words is active
      // Enclose "-ly" Words in a yellow underlined <span> tag
      if (this.$refs.checks.highlightLyWords) {
        var lyRegex = new RegExp(/\b\w+ly/, 'gi')
        replaceContent = replaceContent.replace(lyRegex, function(match) {
          const result = '<span class="text-warning border-bottom border-warning">' + match + '</span>'
          return result
        })
      }

      // If there are highlight keywords
      // Enclose keywords in red underlined <span> tag
      if (this.$refs.highlight.keywordList.length) {
        var joinedKeywords = this.$refs.highlight.keywordList.join('\\b|\\b')
        joinedKeywords = '\\b' + joinedKeywords + '\\b'
        var keywordRegex = new RegExp(joinedKeywords, 'gi')

        replaceContent = replaceContent.replace(keywordRegex, function(match) {
          const result = '<span class="text-danger border-bottom border-danger">' + match + '</span>'
          return result
        })
      }
  
      const insertNode = document.getElementById('input-overlay')
      insertNode.innerHTML = replaceContent
      
      // Count number of words highlighted
      if (this.$refs.highlight.keywordList.length == 0) {
        this.highlightedWordCount = 0
      }
      if (this.$refs.highlight.keywordList.length) {
        const count = (str) => {
          return ((str || '').match(keywordRegex) || []).length
        }
        this.highlightedWordCount = count(replaceContent)
      }

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
