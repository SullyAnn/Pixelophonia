module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Pixelophonia',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  
  serverMiddleware: [
    '~/api/index.js'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios','~/io', '@nuxtjs/auth'],
  env:{
    WS_URL: process.env.WS_URL || 'http://localhost:3000'
  },
//   auth: {
//     strategies: {
//       local: {
//         endpoints: {
//           login: { url: "/api/login", method: "post", propertyName: 'data.token' },
// //        refresh: { url: "/api/auth/refresh-token", method: "post" },
//           logout: false, //  we don't have an endpoint for our logout in our API and we just remove the token from localstorage
//           admin: { url: "/admin/", method: "get", propertyName:'data' }
//         },
//         tokenType:''
//       }
//     }
//   },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config) {
 
      config.node = {
           fs: 'empty'
       }
   }
  },

  auth: {
  localStorage: true,
  strategies: {
    local: {
      endpoints: {
        login: {
          url: '/api/login',
          method: 'post',
          propertyName: 'token'
        },
        logout: false,
        user: {
          url: '/api/user',
          method: 'get',
          propertyName: false
        },
      },
    }
  },
  redirect: {
    logout: '/admin/login',
    callback: '/login',
    home: '/admin/'
  },
},
}
