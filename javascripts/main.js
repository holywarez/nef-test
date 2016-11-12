Vue.component('question', {
  props: ['description'],
  template: '#question-template',
  data: function() {
    return { selectedOption: null }
  },
  methods: {
    answerWith: function(option) {
      this.selectedOption = null
      if (option == this.description.requiredAnswer) {
        this.$emit('correct')
      } else {
        this.$emit('mistake')
      }
    }
  }
})

Vue.component('answer-option', {
  props: ['value'],
  template: '#option-template',
  methods: {
    isText: function() { return !this.value.match(/^http/i) },
    isUrl: function() { return this.value.match(/^http/i) }
  }
})

new Vue({
  el: '#testApp',

  data: {
    answers: [],
    questionsAmount: 2,
    leftQuestions: 0,
    testRunning: false,
    score: 0,
    mistakes: 0,
    questions: []
  },

  methods: {
    reset: function() {
      this.leftQuestions = this.questionsAmount
      this.score = 0
      this.mistakes = 0
      this.currentQuestion = null
      this.answers = []
    },

    runTest: function() {
      this.reset()
      this.testRunning = true
      this.nextQuestion()
    },

    nextQuestion: function() {
      if (this.leftQuestions < 1) {
        this.testRunning = false
        return
      }

      this.leftQuestions--
      this.currentQuestion = this.obtainQuestion()
    },

    obtainQuestion: function() {
      var topic = _.sample(topics)
      var combinations = _.map(topic.combinations, _.clone)
      var reversed = (topic.reversible && Math.random() * 100 < 50)

      if (reversed) {
        combinations = _.map(combinations, _.reverse)
      }

      var requiredOption = _.clone(_.sample(combinations))

      return {
        type: topic.type,
        reversed: reversed,
        handwriting: reversed && topic.handwriting && Math.random() * 100 < 50,
        definition: requiredOption[0],
        requiredAnswer: requiredOption[1],
        options: _.shuffle(_.map(combinations, _.last))
      }
    },

    handleMistake: function() {
      this.mistakes++
      this.answers.push(this.currentQuestion)
      this.nextQuestion()
    },

    handleCorrect: function() {
      this.score++
      this.nextQuestion()
    }
  }
})
