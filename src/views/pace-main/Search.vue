<template>
  <v-container id="login" class="justify-center mt-0 pt-0 pb-0 full-height" tag="section">
    <v-row justify="center" class="full-height">
      <v-col lg="11" md="11" sm="8" xl="7" class="pl-2 pr-2 pt-0 pb-0">
        <v-card class="elevation-4">
          <v-row class="bg-pace-yellow">
            <v-col lg="5" md="5" cols="12" class="pa-0 full-height-md d-flex flex-column pt-0 left-block">
              <div class="bg-pace-orange py-4 px-10">
                <div class="text-right">
                  <a class="white--text ml-auto mr-3 mt-3 white--text signin-link d-flex justify-end flex-wrap" v-if="user">
                    <span>Hi {{ user.firstName + ' ' + user.lastName }} </span>&nbsp;
                    <span class="v-underline" @click="logout"> Sign out ></span></a>
                  <a @click="login" class="v-underline white--text ml-auto mr-3 mt-3 white--text signin-link" v-else>Sign in ></a>
                </div>
                <h3 class="white--text page-title mt-4">Search</h3>
                <v-text-field
                  label="Enter a keyword"
                  append-icon="mdi-magnify"
                  single-line
                  solo
                  class="search-input"
                  v-model="search"
                  @input="changeFilters"
                ></v-text-field>
                <p class="text-right"><a class="white--text v-underline" :style="`cursor: ` + (resourceCount && resourceCount > 0 && isMobile ? 'pointer' : 'text')" @click="browseResourceList" >Browse {{ resourceCount && resourceCount > 0 ? resourceCount : 'no' }} result{{ resourceCount != 1 ? 's' : ''}} ></a></p>
              </div>
              <div class="search-info px-sm-10 px-1 pt-2">
                <v-tabs
                  v-model="tab"
                  fixed-tabs
                >
                  <v-tab>Filters:</v-tab>
                  <v-tab>Audience {{ audience.length > 0 ? `(${audience.length})` : '' }}</v-tab>
                  <v-tab>Type {{ type.length > 0 ? `(${type.length})` : '' }}</v-tab>
                  <v-tab>Mode {{ mode.length > 0 ? `(${mode.length})` : '' }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab" class="ma-1 mt-2">
                  <v-tab-item>
                    <v-card class="elevation-1 pa-5 tab-content" v-if="!user && selectedCapabilities.length == 0 && audience.length == 0 && type.length == 0 && mode.length == 0">
                      <p class="mb-1">Welcome to the Palliative Care Education Directory</p> <br>
                      <p>To help you find what you need, take a moment to set your search filters</p>
                      <div class="mt-10">
                        <div class="text-right">
                          <span class="more-filters mr-5">Ok, show me</span>
                          <v-btn color="bg-pace-yellow" fab small @click="tab = 1">
                            <v-icon color="white">mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <p class="tip mt-5">Tip: <a @click="register" class="tip v-underline"> Create an account</a> to save your filters for future use<br>
                        Note: You can clear your filters at any time to see all results.
                      </p>
                    </v-card>
                    <v-card class="elevation-1 pa-5 tab-content" v-else>
                      <template v-if="resourceCount && resourceCount > 0">
                        <p class="mb-1">Too many results?</p>
                        <p>Take a minute to review your filters.</p>
                      </template>
                      <p v-else>Adjust filters for more results.</p>
                      <p>Current filters:</p>

                      <p class="mb-0 d-flex" v-if="selectedCapabilities.length > 0">
                        <router-link to="/?tab=2" class="capability-link"><b class="mr-2">Capabilities:</b></router-link> {{capabilityString }} 
                        <span class="ml-auto"><v-icon @click="clearCapabilities(), changeFilters()">mdi-close</v-icon></span>
                      </p>
                      <p class="mb-0" v-else><router-link to="/" class="capability-link"><b>Back to capability options</b></router-link></p>
                      <p class="mb-0 d-flex" v-if="audience.length > 0">
                        <b class="mr-2" aria-controls @click="tab = 1">Audiences:</b> {{ selectedAudienceItems }}
                        <span class="ml-auto"><v-icon @click="audience = [], changeFilters()">mdi-close</v-icon></span>
                      </p>
                      <p class="mb-0 d-flex" v-if="type.length > 0">
                        <b class="mr-2" aria-controls @click="tab = 2">Types:</b> {{ selectedTypeItems }}
                        <span class="ml-auto" ><v-icon @click="type = [], changeFilters()">mdi-close</v-icon></span>
                      </p>
                      <p class="d-flex" v-if="mode.length > 0">
                        <b class="mr-2" aria-controls @click="tab = 3">Modes:</b> {{ selectedModeItems }}
                        <span class="ml-auto" ><v-icon @click="mode = [], changeFilters()">mdi-close</v-icon></span>
                      </p>
                      <div class="mt-10">
                        <div class="text-right">
                          <span class="more-filters mr-5">More filters</span>
                          <v-btn color="bg-pace-yellow" fab small @click="tab = 1">
                            <v-icon color="white">mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <p class="tip mt-5">Tip: Tap a filter above to edit your selection.</p>
                    </v-card>
                    
                  </v-tab-item>
                  <v-tab-item>
                    <v-card class="elevation-1 pa-5 tab-content">
                      <div
                        v-for="(item, i) in audienceItems"
                        :key="i"
                      >
                        <v-checkbox
                          v-model="audience"
                          @change="changeFilters()"
                          :label="item.name"
                          :value="item.id"
                          hide-details
                        ></v-checkbox>
                      </div>
                      <div class="mt-10">
                        <div class="text-right">
                          <v-btn color="bg-pace-yellow" fab small @click="tab = 2">
                            <v-icon color="white">mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card class="elevation-1 pa-5 tab-content">
                      <div
                        v-for="(item, i) in typeItems"
                        :key="i"
                      >
                        <v-checkbox
                          v-model="type"
                          @change="changeFilters()"
                          :label="item.name"
                          :value="item.id"
                          hide-details
                        ></v-checkbox>
                      </div>
                      <div class="mt-10">
                        <div class="text-right">
                          <v-btn color="bg-pace-yellow" fab small @click="tab = 3">
                            <v-icon color="white">mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card class="elevation-1 pa-5 tab-content">
                      <div
                        v-for="(item, i) in modeItems"
                        :key="i"
                      >
                        <v-checkbox
                          v-model="mode"
                          @change="changeFilters()"
                          :label="item.name"
                          :value="item.id"
                          hide-details
                        ></v-checkbox>
                      </div>
                      <div class="mt-10">
                        <div class="text-right">
                          <v-btn color="bg-pace-yellow" fab small @click="tab = 0">
                            <v-icon color="white">mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </div>
              <div class="d-flex bg-pace-orange flex-column my-resources" v-if="user && isMobile">
                <h3 class="white--text pa-2">My resources</h3>
                <v-list two-line subheader class="pa-2" v-if="myResources.length > 0">
                  <ResourceListItem
                    v-for="(item, i) in myResources"
                    :key="i + 'bookmarked'"
                    :item="item"
                    @view-resource="viewResource(item)"
                    @view-program="viewProgram"
                  />
                </v-list>
              </div>
            </v-col>
            
            <v-col lg="7" md="7" cols="12" class="resource-block pa-2 white pa-md-5 d-flex flex-column">
              <div v-if="!isMobile">
                <template v-if="user">
                  <v-tabs grow v-model="resourceListTab" color="white" slider-color="#FDBB2A" background-color="bg-pace-grey">
                    <v-tab>Results</v-tab>
                    <v-tab>My Resources</v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="resourceListTab">
                    <v-tab-item>
                      <template v-if="!showMyResourcesTab">
                        <v-list two-line subheader class="pt-5 mb-10" v-if="resources.length > 0">
                          <ResourceListItem
                            v-for="(item, i) in resources"
                            :key="i + item.title"
                            :item="item"
                            @view-resource="viewResource(item)"
                            @view-program="viewProgram"
                          />
                          <infinite-loading @infinite="infiniteHandler" spinner="bubbles">
                            <div slot="no-more"></div>
                            <div slot="no-results"></div>
                          </infinite-loading>
                        </v-list>
                        <template v-else>
                          <div v-if="isLoadingResource" class="text-center mt-5">
                            <v-progress-circular
                              :size="70"
                              :width="7"
                              color="pace-yellow"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                          <p v-else class="no-more-text">
                            There are no matching results. Please try clearing some filters and keywords from your search.
                          </p>
                        </template>
                      </template>
                    </v-tab-item>
                    <v-tab-item>
                      <template v-if="showMyResourcesTab">
                        <template v-if="myResourceLoaded">
                          <v-list two-line subheader class="pa-2" v-if="myResources.length > 0">
                            <ResourceListItem
                              v-for="(item, i) in myResources"
                              :key="i + 'bookmarked-desktop' + item.title"
                              :item="item"
                              @view-resource="viewResource(item)"
                              @view-program="viewProgram"
                            />
                          </v-list>
                          <p class="no-more-text" v-else>
                            Resources can be kept for later reference. Simply tap the bookmark 
                            <v-icon
                              class="pace-yellow--text bookmark-icon ml-auto"
                              size="30"
                            >mdi-bookmark-outline</v-icon>.
                          </p>
                        </template>
                        <div v-else class="text-center mt-5">
                          <v-progress-circular
                            :size="70"
                            :width="7"
                            color="pace-yellow"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-tab-item>
                  </v-tabs-items>
                </template>
                <template v-else>
                  <v-list two-line subheader class="pt-5 mb-10" v-if="resources.length > 0">
                    <ResourceListItem
                      v-for="(item, i) in resources"
                      :key="i + item.title"
                      :item="item"
                      @view-resource="viewResource(item)"
                      @view-program="viewProgram"
                    />
                    <infinite-loading @infinite="infiniteHandler" spinner="bubbles">
                      <div slot="no-more"></div>
                      <div slot="no-results"></div>
                    </infinite-loading>
                  </v-list>
                  <template v-else>
                    <div v-if="isLoadingResource" class="text-center mt-5">
                      <v-progress-circular
                        :size="70"
                        :width="7"
                        color="pace-yellow"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                    <p v-else class="no-more-text">
                      There are no matching results. Please try clearing some filters and keywords from your search.
                    </p>
                  </template>
                </template>
              </div>
              
              <div class="d-flex justify-space-between mt-auto mb-5">
                <img class="logo" src="@/assets/PaCE_Logo_RGB.png" />
              </div>
            </v-col>
          </v-row>
          <v-dialog v-model="showResource" persistent content-class="resource-dialog ma-0">
            <Program 
              @close-modal="closeResource" 
              @view-module="viewModule"
              :resourceId="selectedResource.id"
              :viewMode="selectedResource.viewMode"
              v-if="selectedResource && selectedResource.isProgram" 
            />
            <Resource 
              @close-modal="closeResource" 
              :resourceId="selectedResource.id" 
              :isModuleView="moduleMode" 
              v-else 
            />
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { capabilityCodes } from "@/data/capabilitycodes";
import { mapGetters, mapActions } from 'vuex'
import Resource from '@/components/Pace-resource/Resource'
import Program from '@/components/Pace-resource/Program'
import ResourceListItem from '@/components/customComponents/ResourceListItem'
import debounce from 'debounce'
import { findIndex } from "lodash";
export default {
  name: "Search",

  components: {
    Resource,
    Program,
    ResourceListItem
  },

  data: () => ({
    tab: null,
    audience: [],
    audienceItems: [],
    type: [],
    typeItems: [],
    mode: [],
    modeItems: [],
    resources: [],
    myResources: [],
    selectedResource: {
      id: null,
      items: []
    },
    showResource: false,
    tags: [],
    resourceCount: null,
    selectedCapabilities: [],
    capabilityString: null,
    capabilityCodes: capabilityCodes,
    selectedResourceFilter: null,
    search: null,
    selectedCapabilityCodeStrings: [],
    pagination: {
      pageSize: 10,
      pageIndex: 1,
      total: null
    },
    isLoadingResource: true,
    resourceLoaded: false,
    moduleMode: false,
    isMobile: false,
    resourceListTab: 0,
    myResourceLoaded: false,
    showMyResourcesTab: false
  }),

  computed: {
    ...mapGetters("auth", ["user"]),

    selectedAudienceItems() {
      let nameArray = this.audience.map(id => {
        for (let i = 0; i < this.audienceItems.length ; i ++) {
          if (this.audienceItems[i].id == id) {
            return this.audienceItems[i].name;
          }
        }
      });

      return nameArray.join('; ');
    },

    selectedTypeItems() {
      let nameArray = this.type.map(id => {
        for (let i = 0; i < this.typeItems.length ; i ++) {
          if (this.typeItems[i].id == id) {
            return this.typeItems[i].name;
          }
        }
      });

      return nameArray.join('; ');
    },

    selectedModeItems() {
      let nameArray = this.mode.map(id => {
        for (let i = 0; i < this.modeItems.length ; i ++) {
          if (this.modeItems[i].id == id) {
            return this.modeItems[i].name;
          }
        }
      });

      return nameArray.join('; ');
    },
  },

  watch: {
    user: {
      handler: async function (val) {
        if (val) {
          this.loadCurrentResources();
        }
      },
      deep: true
    },

    resourceListTab(val) {
      if (val == 1) {
        this.showMyResourcesTab = false;
        this.$nextTick(() => {
          this.showMyResourcesTab = true;
        })
      } else {
        this.showMyResourcesTab = true;
        this.$nextTick(() => {
          this.showMyResourcesTab = false;
        })
      }
    }
  },

  methods: {
    ...mapActions("tag", ["getTags"]),
    ...mapActions("resource", ["getResourceCount", "filterResources", "getCurrentResources"]),
    ...mapActions(['toggleAuthModal']),

    login() {
      this.toggleAuthModal('LOGIN');
    },

    register() {
      this.toggleAuthModal('REGISTER');
    },

    goToSearch() {
      this.$router.push({ name: 'Greeting' })
    },

    viewResource(item) {
      this.selectedResource = Object.assign({}, item);
      this.selectedResource = JSON.parse(JSON.stringify(this.selectedResource));
      this.showResource = true;
    },

    viewProgram(id, viewMode) {
      this.selectedResource = {
        id: id,
        isProgram: true,
        viewMode
      };
      this.showResource = true;
    },

    viewModule(item) {
      this.showResource = false;
      this.selectedResource = Object.assign({}, item);
      this.selectedResource = JSON.parse(JSON.stringify(this.selectedResource));
      this.moduleMode = true;
      this.showResource = true;
    },

    async closeResource(isModuleView = false) {
      this.moduleMode = false;
      this.showResource = false;
      if (isModuleView) {
        this.selectedResource = Object.assign({}, {
          id: this.selectedResource.programResourceId,
          isProgram: true
        });
        this.showResource = true;
      } else {
        this.selectedResource = Object.assign({}, {
          id: null,
          items: []
        });
      }

      if (this.user && !this.isMobile) {
        this.loadCurrentResources();
      }
    },

    async loadCurrentResources() {
      this.myResourceLoaded = false;
      this.myResources = [];
      let res = await this.getCurrentResources();
      this.myResources = JSON.parse(JSON.stringify(res.data));
      setTimeout(() => {
        this.myResourceLoaded = true;
      }, 500)
    },

    browseResourceList() {
      if (window.innerWidth < 600) {
        this.$router.push('/resources');
      } else {
        // this.resourceListTab = 0;
      }
    },

    async viewResourceList($state = null) {
      if (this.resourceCount > 0) {
        this.isLoadingResource = true;
        let payload = {
          tagFilterAudienceIds: this.audience,
          tagFilterTypeIds: this.type,
          tagFilterModeIds: this.mode,
          searchText: this.search
        };

        payload['pageIndex'] = this.pagination.pageIndex;
        payload['pageSize'] = this.pagination.pageSize;
        
        if (this.selectedCapabilityCodeStrings.length > 0) {
          payload['capabilityCodes'] = this.selectedCapabilityCodeStrings;
        }
        if (this.search == null || this.search.length == 0) {
          delete payload['searchText']
        }
        localStorage.setItem('filters', JSON.stringify(payload));
        if (window.innerWidth < 600) {
          this.$router.push('/resources');
        } else {
          let res = await this.filterResources(payload);
          this.resources = [ ...this.resources, ...res.results];
          if ($state) {
            $state.loaded();
          }
          this.pagination.pageSize = res.pageSize;
          this.pagination.total = res.total;
          this.pagination.pageIndex = res.currentPage;
        }
        this.resourceLoaded = true;
        setTimeout(() => { this.isLoadingResource = false; }, 200);
      }
      this.isLoadingResource = false;
    },

    changeFilters: debounce(async function () {
      this.isLoadingResource = true;
      this.resources = [];
      this.pagination = Object.assign({}, {
        pageSize: 10,
        pageIndex: 1,
        total: null
      });
      let payload = {
        tagFilterAudienceIds: this.audience,
        tagFilterTypeIds: this.type,
        tagFilterModeIds: this.mode,
        searchText: this.search,
      };
      if (this.selectedCapabilityCodeStrings.length > 0) {
        payload['capabilityCodes'] = this.selectedCapabilityCodeStrings;
      }
      if (this.search == null || this.search.length == 0) {
        delete payload['searchText']
        localStorage.removeItem('searchText');
      } else {
        localStorage.setItem('searchText', this.search);
      }
      localStorage.setItem('filters', JSON.stringify(payload));
      this.resourceCount = await this.getResourceCount(payload);
      if (window.innerWidth < 600) {
      } else {
        this.viewResourceList();
      }
    }, 500),

    infiniteHandler($state) {
      let totalPages = Math.ceil(this.pagination.total / this.pagination.pageSize);
      if (totalPages > this.pagination.pageIndex) {
        this.pagination.pageIndex ++;
        this.viewResourceList($state);
      } else {
        $state.complete();
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.reload();
    },

    clearCapabilities() {
      this.selectedCapabilities = [];
      this.selectedCapabilityCodeStrings = [];
      this.capabilityString = null;
      localStorage.removeItem('selectedCapabilities');
      localStorage.removeItem('selectedResource');
    },

    validFilters() {
      let items = [];
      for (let i = 0; i < this.audience.length; i ++) {
        let index = findIndex(this.audienceItems, (e) => {
            return e.id == this.audience[i];
        }, 0);
        if (index > -1) {
          items.push(this.audience[i]);
        }
      }
      this.audience = Object.assign([], items);

      items = [];
      for (let i = 0; i < this.type.length; i ++) {
        let index = findIndex(this.typeItems, (e) => {
            return e.id == this.type[i];
        }, 0);
        if (index > -1) {
          items.push(this.type[i]);
        }
      }
      this.type = Object.assign([], items);

      items = [];
      for (let i = 0; i < this.mode.length; i ++) {
        let index = findIndex(this.modeItems, (e) => {
            return e.id == this.mode[i];
        }, 0);
        if (index > -1) {
          items.push(this.mode[i]);
        }
      }
      this.mode = Object.assign([], items);
    },

    async onResize() {
      if (window.innerWidth < 600) {
        if (!this.isMobile) {
          if (this.user) {
            this.myResourceLoaded = false;
            let res = await this.getCurrentResources();
            if (window.innerWidth < 600) {
              this.resources = res.data;
            } else {
              this.myResources = res.data;
            }
            this.myResourceLoaded = true;
          }
          this.changeFilters();
        }
        this.isMobile = true;
      } else {
        if (this.isMobile) {
          if (this.user) {
            this.myResourceLoaded = false;
            let res = await this.getCurrentResources();
            if (window.innerWidth < 600) {
              this.resources = res.data;
            } else {
              this.myResources = res.data;
            }
            this.myResourceLoaded = true;
          }
          this.changeFilters();
        }
        this.isMobile = false;
      }
    }
  },

  created() {
    if (window.innerWidth < 600) {
      this.isMobile = true;
    } else this.isMobile = false;
  },

  async mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
    this.selectedCapabilities = JSON.parse(localStorage.getItem('selectedCapabilities'));
    this.selectedResourceFilter = parseInt(localStorage.getItem('selectedResource'));
    let filters = JSON.parse(localStorage.getItem('filters'));
    if (filters) {
      this.audience = filters.tagFilterAudienceIds;
      this.type = filters.tagFilterTypeIds;
      this.mode = filters.tagFilterModeIds;
    }
    if (this.selectedCapabilities && this.selectedResourceFilter > -1) {
      let resultString = "";
      resultString += this.capabilityCodes[this.selectedResourceFilter].name;
      resultString += " (";
      this.selectedCapabilityCodeStrings = [];
      for (let i = 0; i < this.selectedCapabilities.length; i ++) {
        this.selectedCapabilityCodeStrings.push(this.capabilityCodes[this.selectedResourceFilter].short + (this.selectedCapabilities[i] + 1));
        resultString += this.capabilityCodes[this.selectedResourceFilter].short + (this.selectedCapabilities[i] + 1) + "; ";
      }
      resultString = resultString.substring(0, resultString.length - 2);
      resultString += ")";
      this.capabilityString = resultString;
    } else {
      this.selectedCapabilities = [];
      this.selectedResourceFilter = null;
    }
    var sortByName = function(a, b) {
      if (a.name > b.name) return 1;
      else return -1;
    }
    this.audienceItems = await this.getTags('FilterAudience');
    this.audienceItems = this.audienceItems.sort(sortByName);
    this.typeItems = await this.getTags('FilterType');
    this.typeItems = this.typeItems.sort(sortByName);
    this.modeItems = await this.getTags('FilterMode');
    this.modeItems = this.modeItems.sort(sortByName);
    this.validFilters();
    this.changeFilters();

    if (this.user) {
      this.loadCurrentResources();
    }
    
  }
};
</script>

<style lang="scss" scoped>
.logo {
  max-width: 369px;
  max-height: 70px;
  width: 100%;
  height: auto;
}

::v-deep .v-slide-group__prev, ::v-deep .v-slide-group__next {
  display: none!important;
}

::v-deep .search-input .v-text-field__details {
  display: none!important;
}

.left-block {
  ::v-deep .v-tab {
    color: #757575;
    font-weight: normal;
    font-size: 16px;
    text-transform: capitalize;
    letter-spacing: 0;
    text-align: center;
    padding: 0;
  }

  ::v-deep .v-tab::after {
    content: '';
    width: 100%;
    height: 2px;
    background-color: currentColor;
    position: absolute;
    bottom: 0;
  }

  ::v-deep .v-tab--active {
    background-color: transparent;
    color: white;
  }

  .search-info {
    background: url('../../assets/PaCE_Spider_GraphicElement.png') #FDBB2A;
    background-size: 300px 300px;
    background-repeat: no-repeat;
  }

  ::v-deep .theme--light.v-tabs > .v-tabs-bar {
    background-color: transparent;
  }

  ::v-deep .theme--light.v-tabs-items {
    border-radius: 4px;
    border: 1px solid #B2B2B2;
  }

  .tab-content {
    color: #4a4a4a;
    height: 400px;
    overflow-y: auto;
    .capability-link {
      color: #4a4a4a;
    }
  }
}

.my-resources {
  flex: 1;
}

.more-filters {
  font-size: 17px;
  font-weight: bold;
}

.tip {
  font-size: 12px;
  color: $pace-grey;
}

::v-deep .v-input--checkbox .v-input__slot {
  display: flex;
  flex-direction: row-reverse;
}

.logo {
  max-width: 264px;
  max-height: 50px;
  width: 100%;
  height: auto;
}

.no-more-text {
  font-size: 14px;
  padding: 0 40px;
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 600px) {
  .v-dialog {
    margin: 0;
    height: 100vh;
  }

  ::v-deep .my-resources {
    height: unset;
  }

  .no-more-text {
    display: none;
  }
}

</style>
