<template>
  <teleport to="body">
    <div v-if="show">
      <div
        class="modal d-block"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-1-title"
        @click.self="$emit('close')"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="modal-1-title" class="modal-title">What is Write Concise?</h5>
              <button type="button" class="close" aria-label="Close" @click="$emit('close')">&times;</button>
            </div>
            <div class="modal-body">
              <p>Write Concise is a tool to help you write better by writing less based on my editing workflow.</p> 
              <p>Wondering why and how to write concisely? Read these:</p>
              <ul>
                  <li>
                  <a 
                    href="https://www.orwell.ru/library/essays/politics/english/e_polit/" 
                    class="text-info" 
                    target="_blank" 
                    rel="noopener"
                  >
                    Politics and the English Language by George Orwell
                  </a>
                  </li>
                  <li>
                  <a 
                    href="https://dilbertblog.typepad.com/the_dilbert_blog/2007/06/the_day_you_bec.html" 
                    class="text-info" 
                    target="_blank" 
                    rel="noopener"
                  >
                    The Day You Became A Better Writer by Scott Adams
                  </a>
                  </li>
                  <li>
                  <a href="http://paulgraham.com/writing44.html" class="text-info" target="_blank" rel="noopener">
                    Writing, Briefly by Paul Graham
                  </a>
                  </li>
              </ul>
              <p>
                Write Concise is made by <a href="https://ianvanagas.com/" target="_blank" rel="noopener" class="text-info">Ian Vanagas</a>
              </p>
              <p>
                Any feedback or issues? <a href="mailto:ianvanagas@gmail.com" class="text-info" target="_blank" rel="noopener">Send me an email.</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: ['show'],
  emits: ['close'],
  watch: {
    show(value) {
      document.body.classList.toggle('modal-open', value);
      if (value) {
        window.addEventListener('keydown', this.onKeydown);
      } else {
        window.removeEventListener('keydown', this.onKeydown);
      }
    }
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape') {
        this.$emit('close');
      }
    }
  }
}
</script>
