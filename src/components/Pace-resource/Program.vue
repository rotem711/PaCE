<template>
<v-container class="py-0 resource-container">
  <v-row class="white resource">
    <v-col cols="12" class="pa-0 full-height-md d-flex flex-column pt-0" v-if="resource">
      <div class="bg-pace-orange py-3 px-4 page-header d-flex justify-space-between">
        <div class="page-header-title-block d-flex align-center">
          <v-icon
            class="white--text d-sm-none mr-3"
            size="30"
            aria-controls
            @click="closeDialog"
          >mdi-arrow-left</v-icon>
          <span class="white--text page-header-title mr-3">{{ resource && resource.title }}</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="pace-yellow--text bookmark-icon ml-auto"
                size="30"
                aria-controls
                @click="toggleBookmark"
                v-bind="attrs"
                v-on="on"
              >{{ resource.isBookmark ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}</v-icon>
            </template>
            <span>{{ resource.isBookmark ? 'Remove from' : 'Add to' }} 'My Resources'</span>
          </v-tooltip>
        </div>
        <div class="d-none d-sm-block">
          <v-icon
            class="white--text"
            size="30"
            aria-controls
            @click="closeDialog"
          >mdi-close</v-icon>
        </div>
      </div>
      <div class="pa-0">
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab>
            Modules
          </v-tab>
          <v-tab>
            Summary
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="ma-1 mt-2">
          <v-tab-item>
            <div class="pa-4">
              <div v-for="(item, index) in programModules" :key="index">
                <h3 aria-controls @click="goToModule(item)">{{item.title}}</h3>
                <p class="pace-grey--text" v-html="item.overview"></p>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="pa-4">
              <div class="d-flex align-center">
                <v-avatar size="64" color="grey">
                  <v-icon>{{ 'mdi-' + resource.typeLogo }}</v-icon>
                </v-avatar>
                <h3 class="ml-4">{{ resourceType }}</h3>
              </div>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a :href="resource.url" target="_blank" class="title mt-4" v-bind="attrs" v-on="on">{{ resource.title }}</a>
                </template>
                <span>click here to view the resource on our project partner website</span>
              </v-tooltip>
              <br/>

              <a :href="resource.projectUrl" target="_blank">{{ resource.projectName }}</a>
              <div v-html="resource.overview" class="mt-6"></div>
              <p class="mb-0" v-if="resource.endorsements"><b>Certifications</b></p>
              <p>{{ resource.endorsements }}</p>
              <p v-if="resource.outcome" class="mb-2"><b>Learning Outcomes</b></p>
              <div v-html="resource.outcome" class="mt-2"></div>
              <p class="mt-4 mb-0" v-if="selectedAudienceItems.length > 0"><b>Audience:</b></p>
              <p class="mb-0">{{ selectedAudienceItems }}</p>
              <p class="mt-2 mb-0" v-if="selectedTypeItems.length > 0"><b>Type:</b></p>
              <p class="mb-0">{{ selectedTypeItems }}</p>
              <p class="mt-2 mb-0" v-if="selectedModeItems.length > 0"><b>Mode:</b></p>
              <p class="mb-0">{{ selectedModeItems }}</p>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <div class="pa-4 mb-0 mb-sm-10 mt-auto d-flex justify-end align-end">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="bg-pace-yellow" small fab @click="shareResource" v-bind="attrs" v-on="on">
              <v-icon
                class="white--text"
                aria-controls
              >mdi-share-variant</v-icon>
            </v-btn>
          </template>
          <span>Share resource</span>
        </v-tooltip>
      </div>
    </v-col>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
      :timeout="-1"
    >
      To keep items for later in 'My Resources' and for PaCE to recall your filters you need to sign-in.
      <br/>
        <p class="mb-0 mt-2 text-center">
          <a @click="register">Create an account</a> | 
          <a @click="login">Sign in</a> |
          <a @click="snackbar = false">No thanks</a>
        </p>
    </v-snackbar>
  </v-row>
</v-container>
</template>

<script>
import { resourceTypeEnumItems, tagTypeEnumItems } from "@/data/staticItems";
import { mapGetters, mapActions } from 'vuex'
import resourceDetailMixin from "@/mixins/resourceDetailMixin";

export default {
  name: "Program",

  mixins: [resourceDetailMixin],

  props: {
    resourceId: String,
    viewMode: {
      type: String,
      default: 'MODULES'
    }
  },

  data: () => ({
    tab: null,
    isBookmarked: true,
    resourceTypeItems: resourceTypeEnumItems,
    tagTypeItems: tagTypeEnumItems,
    resource: null,
    audienceItems: [],
    typeItems: [],
    modeItems: [],
    snackbar: false,
    loginModal: false
  }),

  computed: {
    ...mapGetters("auth", ["user"]),
    programModules() {
      if (this.resource && this.resource.items) {
        let items = Object.assign([], this.resource.items);
        items.sort(function(a, b) {
          if (a.itemNum > b.itemNum) return 1;
          else return -1;
        });
        return items;
      } else {
        return [];
      }
    }
  },

  watch: {
    user: {
      handler: async function (val) {
        if (!val) {
          this.snackbar = true;
        } else {
          this.snackbar = false;
          this.resource = await this.getResourceDetail(this.resourceId);
        }
      }
    },

    resourceId: {
      handler: async function (val) {
        if (val) {
          this.resource = await this.getResourceDetail(val);
        }
      }
    },

    viewMode(val) {
      if (val == 'SUMMARY') {
        this.tab = 1;
      }
    }
  },

  methods: {
    ...mapActions("resource", ["bookmarkResource", "unbookmarkResource", "getResourceDetail"]),
    ...mapActions(["toggleAuthModal"]),
    goToModule(item) {
      this.$emit('view-module', item);
    },

    login() {
      this.toggleAuthModal('LOGIN');
    },

    register() {
      this.toggleAuthModal('REGISTER');
    }
  },

  async mounted() {
    if (this.resourceId) {
      this.resource = await this.getResourceDetail(this.resourceId);
    }
    if (this.viewMode == 'SUMMARY') {
      this.tab = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep blockquote {
  border-left: .25em solid #dfe2e5;
  color: #6a737d;
  padding-left: 1em;
  margin: 20px 0!important;
}

.resource-container {
  min-height: 100%;
  display: flex;
}

.resource {
  min-height: 100%;
}

::v-deep .resource .v-tab {
  background-color: $pace-yellow;
}

::v-deep .resource .theme--light.v-tabs-items {
  border: none;
}

.page-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-header-title-block {
  width: calc(100% - 40px);
}

@media (max-width: 600px) {
  .page-header-title-block {
    width: calc(100vw - 40px);
  }
}
</style>
