// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const createStore = () => {
  var pluginsModules = {}
  for (let i in Vue.SWPlugins) {
    let plugin = Vue.SWPlugins[i]
    if (plugin.storeModule) {
      pluginsModules[plugin.name] = plugin.storeModule
    }
  }

  var $parse = require('parse')
  $parse.initialize('noctuasky')
  $parse.serverURL = 'https://api.noctuasky.org/parse'

  return new Vuex.Store({
    modules: {
      plugins: {
        modules: pluginsModules
      }
    },
    state: {
      stel: null,
      showNavigationDrawer: false,
      showAboutDialog: false,
      showDataCreditsDialog: false,
      showPrivacyDialog: false,
      showViewSettingsDialog: false,
      showPlanetsVisibilityDialog: false,
      showSkyThisMonthDialog: false,
      showLocationDialog: false,
      selectedObject: undefined,

      showSidePanel: false,
      fullscreen: false,

      autoDetectedLocation: {
        shortName: 'Unknown',
        country: 'Unknown',
        streetAddress: '',
        lat: 0,
        lng: 0,
        alt: 0,
        accuracy: 5000
      },

      currentLocation: {
        shortName: 'Unknown',
        country: 'Unknown',
        streetAddress: '',
        lat: 0,
        lng: 0,
        alt: 0,
        accuracy: 5000
      },

      useAutoLocation: true
    },
    mutations: {
      replaceStelWebEngine (state, newTree) {
        // mutate StelWebEngine state
        state.stel = newTree
      },
      toggleBool (state, varName) {
        _.set(state, varName, !_.get(state, varName))
      },
      setValue (state, { varName, newValue }) {
        _.set(state, varName, newValue)
      },
      setAutoDetectedLocation (state, newValue) {
        state.autoDetectedLocation = { ...newValue }
        if (state.useAutoLocation) {
          state.currentLocation = { ...newValue }
        }
      },
      setUseAutoLocation (state, newValue) {
        state.useAutoLocation = newValue
        if (newValue) {
          state.currentLocation = { ...state.autoDetectedLocation }
        }
      },
      setCurrentLocation (state, newValue) {
        state.useAutoLocation = false
        state.currentLocation = { ...newValue }
      },
      setSelectedObject (state, newValue) {
        state.selectedObject = newValue
      }
    },
    actions: {
      addEmailToMailingList ({ commit, state }, email) {
        var MailingList = $parse.Object.extend('MailingList')
        var entry = new MailingList()
        entry.set('email', email)
        return new Promise((resolve, reject) => {
          entry.save(null, {
            success: resolve(),
            error: reject(new Error(' to save email in mailing list'))
          })
        })
      }
    }
  })
}

export default createStore
