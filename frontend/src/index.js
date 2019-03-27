var vue1 = new Vue({
  el: '#vue1',
  data: {
    message: 'Copy DropBox Files',
    fileTypes: [{name:'all', value: undefined},{name:'image',
    code:['jpg','png']}, {name:'text', code:['txt','docx']} ],
    toRemove: [true, false],
    post: {selectedFile: undefined, toRemove:false,from:undefined, to: undefined, max:undefined},
    loggedIn:false
  },
  methods: {
    copyFiles: function () {
      axios
        .post('http://localhost:3000/copy', this.post)
        .then(res => console.log(res))
    },

  }
});

var vue2 = new Vue({
  el:'#vue2',
  data: {
    loggedIn: false,
    user: {
      name: '',
      password:''
    }

  },
  methods: {
    logUserIn: function () {
      console.log(this.loggedIn)
      this.loggedIn = !this.loggedIn;
      console.log(this.loggedIn)
    }
  }
});

Vue.component('option-item', {
  props: ['theOption'],
  template: '<option>{{ theOption }}</option>'
})

// var vue2 = new Vue({
//   el: '#vue2',
//   data: {
//     filesTypes: ['image', 'text'],
//     delete: ['true', 'false']
//   }

// })

















// function () {
//   let myRequest = new XMLHttpRequest();
//   myRequest.open('POST', 'http://localhost:3000/copy', true);
//   myRequest.setRequestHeader('Content-Type', 'application/json');

//   console.log(myRequest)
//   myRequest.send();