
var topics = []

topics.push({
  type: 'matches',
  combinations: [
    ['insincere', "Somebody that doesn't show his emotions"],
    ['arrogant', "Person who thinks that he is better than other"],
    ['stubborn', "No matter — is he right or not, he acts on his own"]
  ]
})

topics.push({
  type: 'illustrations',
  combinations: [
    ['Punks', 'https://s-media-cache-ak0.pinimg.com/564x/1d/c5/e6/1dc5e6b56cf185d7571ed7aa878e8065.jpg'],
    ['Teddy Boys', 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2016/05/24/09/teddyboys2405r.jpg'],
    ['Goths', 'http://2.bp.blogspot.com/_Wvcp0LJM_HY/TL02iFD2DsI/AAAAAAAAbqg/K80sw68DOHE/s1600/Wave_Gotik_Treffen_Festival__16.jpg']
  ]
})

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
      var requiredOption = _.sample(topic.combinations)

      return {
        type: topic.type,
        definition: requiredOption[0],
        requiredAnswer: requiredOption[1],
        options: _.map(topic.combinations, _.last)
      }
    },

    handleMistake: function() {
      this.mistakes++
      this.nextQuestion()
    },

    handleCorrect: function() {
      this.score++
      this.nextQuestion()
    }
  }
})
