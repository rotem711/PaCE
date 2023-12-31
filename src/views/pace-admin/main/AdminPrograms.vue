<template>
  <div >
    <div class="mt-4">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="resources"
          hide-default-footer
          class="border"
          :loading="isLoading"
          :items-per-page="pagination.pageSize"
          loading-text="Loading... Please wait"
          @update:options="onOptionUpdated"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search Programs"
                  single-line
                  hide-details
                  clearable
                  @input="searchInput"
                ></v-text-field>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" persistent max-width="800px" v-hotkey="keymap">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">
                    <v-icon>mdi-select-group</v-icon>
                    Add Program
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="bg-pace-yellow">
                    <span class="headline white--text">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-select
                            :items="projects"
                            item-value="id"
                            item-text="name"
                            v-model="form.projectId"
                            @change="projectChanged"
                            label="Project"
                            :error-messages="fieldErrors('form.projectId')"
                            @input="$v.form.projectId.$touch()"
                            @blur="$v.form.projectId.$touch()"
                          >
                            <template v-slot:label>
                              <span>Project</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-text-field
                            label="Title"
                            v-model="form.title"
                            :error-messages="fieldErrors('form.title')"
                            @input="$v.form.title.$touch()"
                            @blur="$v.form.title.$touch()"
                          >
                            <template v-slot:label>
                              <span>Title</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-text-field>
                          <v-text-field
                            label="Url"
                            v-model="form.url"
                          ></v-text-field>
                          <p class="tiptap-label mb-0">Overview</p>
                          <tiptap-vuetify
                            v-model="form.overview"
                            placeholder="Overview"
                            :card-props="{ flat: true, outlined: true }"
                            :extensions="extensions"
                          />
                          <v-textarea
                            label="Certifications"
                            v-model="form.endorsements"
                          ></v-textarea>
                          <v-select
                            label="Type"
                            v-model="form.typeId"
                            :error-messages="fieldErrors('form.typeId')"
                            @blur="$v.form.typeId.$touch()"
                            :items="filterTypeTags"
                            item-text="name"
                            item-value="id"
                          >
                            <template v-slot:label>
                              <span>Type</span>
                              <span class="red--text ml-1">*</span>
                            </template>
                          </v-select>
                          <v-autocomplete
                            v-model="form.tagFilterAudienceIds"
                            :items="filterAudienceTags"
                            item-text="name"
                            item-value="id"
                            chips
                            label="FilterAudience"
                            multiple
                            deletable-chips
                            clearable
                          >
                          </v-autocomplete>
                          <v-autocomplete
                            v-model="form.tagFilterModeIds"
                            :items="filterModeTags"
                            item-text="name"
                            item-value="id"
                            chips
                            label="FilterMode"
                            multiple
                            deletable-chips
                            clearable
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row class="d-flex justify-center" >
                        <v-col md="6" cols="12">
                          <v-list>
                            <v-subheader inset>Selected modules</v-subheader>
                            <draggable
                              v-model="selectedModules"
                              group="resources"
                              class="p-2 cursor-move"
                              style="min-height: 150px"
                              :multiDrag="true"
                              selectedClass="bg-pace-grey"
                            >
                              <v-list-item
                                v-for="(listItem) in selectedModules"
                                :key="listItem.id"
                                :id="listItem.id"
                                :ref="`selected`"
                                @click.stop
                              >
                                <v-list-item-avatar>
                                  <img :src="listItem.projectLogo" />
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="listItem.title"
                                  ></v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </draggable>
                          </v-list>
                        </v-col>
                        <v-col md="6" cols="12">
                          <v-text-field
                            v-model="resourceKeyword"
                            append-icon="mdi-magnify"
                            label="Resources"
                            single-line
                            hide-details
                            clearable
                            @input="searchResource"
                          ></v-text-field>
                          <div v-if="isModuleLoading" class="text-center mt-5">
                            <v-progress-circular
                              :size="70"
                              :width="4"
                              color="primary"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                          <v-list
                            max-height="200px"
                            height="200px"
                            style="overflow-y: scroll"
                            v-else
                            role="listbox"
                          >
                            <draggable
                              :list="totalResources"
                              group="resources"
                              class="p-2 cursor-move"
                              :multiDrag="true"
                              selectedClass="bg-pace-grey"
                            >
                              <v-list-item
                                v-for="(listItem) in totalResources"
                                :key="listItem.id"
                                :id="listItem.id"
                                @click.prevent
                                :ref="`selectedtoimport`"
                              >
                                <v-list-item-avatar>
                                  <img :src="listItem.projectLogo" />
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="listItem.title"
                                  ></v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </draggable>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      class="border-pace-orange pace-orange--text"
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      class="bg-pace-orange white--text"
                      :disabled="$v.form.$invalid"
                      @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-icon 
              small 
              class="mr-2 pace-yellow--text" 
              @click="editItem(item)"
            >mdi-pencil</v-icon>
            <v-icon
              small
              class="pace-orange--text"
              @click="showDeleteConfirmDialog(item)"
            >mdi-delete</v-icon>
          </template>
          <template slot="item.projectId" slot-scope="{ item }">
            {{ getProjectName(item.projectId) }}
          </template>
          <template slot="item.title" slot-scope="{ item }">
            <span class="font-weight-title">{{ item.title }}</span>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reload</v-btn>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2" v-if="pagination.total">
          <v-pagination
            v-model="pagination.pageIndex"
            :length="Math.ceil(pagination.total / pagination.pageSize)"
            @input="loadPrograms"
          ></v-pagination>
        </div>
        <v-dialog v-model="deleteConfirmDialog" max-width="400px">
          <v-card>
            <v-card-title class="bg-pace-yellow">
              <span class="headline white--text">Confirm Deletion</span>
            </v-card-title>
            <v-card-text class="pt-2">
              <span class="title black--text">Are you sure you want to delete this item?</span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="border-pace-orange pace-orange--text"
                @click="deleteConfirmDialog = false"
              >Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn 
                class="bg-pace-orange white--text" 
                @click="deleteItem"
              >Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";
import debounce from "debounce";
import { capabilityCodes } from "@/data/capabilitycodes";
import { resourceTypeEnumItems, tagTypeEnumItems } from "@/data/staticItems";
import { findIndex } from "lodash";
import draggable from "vuedraggable";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from "tiptap-vuetify";

export default {
  name: "AdminPrograms",
  mixins: [validationMixin],
  validations: {
    form: {
      projectId: { required },
      title: { required },
      typeId: { required },
    },
  },
  validationMessages: {
    form: {
      projectId: {
        required: "Project is required",
      },
      title: {
        required: "Title is required",
      },
      typeId: {
        required: "Type is required",
      },
    },
  },
  components: {
    draggable,
    TiptapVuetify,
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Project",
        align: "start",
        sortable: false,
        value: "projectId",
      },
      { text: "Title", value: "title" },
      { text: "Type", value: "typeName", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    resources: [],
    projects: [],
    editedIndex: -1,
    defaultItem: {
      projectId: null,
      title: null,
      url: null,
      endorsements: null,
      typeId: null,
      overview: null,
      isProgram: true,
      tagFilterAudienceIds: [],
      tagFilterTypeIds: [],
      tagFilterModeIds: [],
      items: [], // modules
    },
    search: null,
    form: {
      projectId: null,
      title: null,
      url: null,
      endorsements: null,
      typeId: null,
      overview: null,
      isProgram: true,
      tagFilterAudienceIds: [],
      tagFilterTypeIds: [],
      tagFilterModeIds: [],
      items: [], // modules
    },
    filters: {
      isProgram: true,
    },
    isLoading: false,
    deleteConfirmDialog: false,
    selectedItemId: null,
    tags: [],
    filterAudienceTags: [],
    filterTypeTags: [],
    filterModeTags: [],
    capabilityCodes: capabilityCodes,
    resourceTypeItems: resourceTypeEnumItems,
    tagTypeItems: tagTypeEnumItems,
    capabilityCodeItems: [],
    selectedModules: [],
    totalResources: [],
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      Bold,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak,
    ],
    pagination: {
      pageSize: 15,
      pageIndex: 1,
      total: null,
    },
    resourceKeyword: null,
    isModuleLoading: false,
    sort: {
      sortBy: null,
      isDescending: true,
    },
    selectedOne: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Program" : "Edit Program";
    },

    keymap () {
      return {
        // 'esc+ctrl' is OK.
        'up': {
          keydown: this.moveUp,
        },
        'down': {
          keydown: this.moveDown,
        },
        'left': {
          keydown: this.moveLeft
        },
        'right': {
          keydown: this.moveRight
        }
      }
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.pagination.pageSize = Math.floor((window.innerHeight - 200) / 60);
    this.initialize();
  },

  mounted() {
    for (let i = 0; i < capabilityCodes.length; i++) {
      let code = capabilityCodes[i];
      let items = code.items.map((item, index) => {
        return code.short + (index + 1);
      });
      this.capabilityCodeItems = [...this.capabilityCodeItems, ...items];
    }
  },

  methods: {
    ...mapActions("project", ["getProjects"]),
    ...mapActions("resource", [
      "getResources",
      "filterResources",
      "addResource",
      "getResourceDetail",
      "deleteResource",
      "updateResource",
    ]),
    ...mapActions("tag", ["getTags"]),
    
    onOptionUpdated(options) {
      this.sort.sortBy = options.sortBy[0];
      this.sort.isDescending = options.sortDesc[0];
      this.loadPrograms();
    },

    moveUp() {
      if (this.$refs.selected) {
        let selectedCount = 0;
        let selectedid = null;
        this.$refs.selected.map((item, index) => {
          if (item.$el.className.indexOf("bg-pace-grey") > -1) {
            selectedCount ++;
            selectedid = item.$el.id;
          }
        })
        
        if (selectedCount != 1) {
          return;
        }

        this.selectedOne = findIndex(this.selectedModules, function (o) {
          return o.id == selectedid;
        });

        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        if (this.selectedOne > 0) {
          this.selectedModules.move(this.selectedOne, this.selectedOne - 1);
          this.selectedModules = JSON.parse(JSON.stringify(this.selectedModules));
          this.selectedOne --;
        }
      }
    },

    moveDown() {
      if (this.$refs.selected) {
        let selectedCount = 0;
        let selectedid = null;
        this.$refs.selected.map((item, index) => {
          if (item.$el.className.indexOf("bg-pace-grey") > -1) {
            selectedCount ++;
            selectedid = item.$el.id;
          }
        })
        
        if (selectedCount != 1) {
          return;
        }

        this.selectedOne = findIndex(this.selectedModules, function (o) {
          return o.id == selectedid;
        });
        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        if (this.selectedOne < this.selectedModules.length - 1) {
          this.selectedModules.move(this.selectedOne, this.selectedOne + 1);
          this.selectedModules = JSON.parse(JSON.stringify(this.selectedModules));
          this.selectedOne ++;
        }
      }
    },

    moveLeft() {
      // selectedtoimport
      if (this.$refs.selectedtoimport) {
        let selectedCount = 0;
        let selectedids = [];
        this.$refs.selectedtoimport.map((item, index) => {
          if (item.$el.className.indexOf("bg-pace-grey") > -1) {
            selectedCount ++;
            selectedids.push(item.$el.id);
          }
        })
        
        if (selectedids.length == 0) {
          return;
        }

        let selectedItems = selectedids.map(id => {
          let item = findIndex(this.totalResources, function (o) {
            return o.id == id;
          });
          return this.totalResources[item];
        })

        this.selectedModules = [ ...this.selectedModules, ...selectedItems ];

        for (let i = 0; i < selectedids.length; i ++) {
          let item = findIndex(this.totalResources, function (o) {
            return o.id == selectedids[i];
          });
          this.totalResources.splice(item, 1);
          this.totalResources = JSON.parse(JSON.stringify(this.totalResources));
        }
      }
    },

    moveRight() {
      if (this.$refs.selected) {
        let selectedCount = 0;
        let selectedids = [];
        this.$refs.selected.map((item, index) => {
          if (item.$el.className.indexOf("bg-pace-grey") > -1) {
            selectedCount ++;
            selectedids.push(item.$el.id);
          }
        })
        
        if (selectedids.length == 0) {
          return;
        }

        let selectedItems = selectedids.map(id => {
          let item = findIndex(this.selectedModules, function (o) {
            return o.id == id;
          });
          return this.selectedModules[item];
        })

        this.totalResources = [ ...this.totalResources, ...selectedItems ];

        for (let i = 0; i < selectedids.length; i ++) {
          let item = findIndex(this.selectedModules, function (o) {
            return o.id == selectedids[i];
          });
          this.selectedModules.splice(item, 1);
          this.selectedModules = JSON.parse(JSON.stringify(this.selectedModules));
        }
      }
    },

    async initialize() {
      this.isLoading = true;
      this.projects = await this.getProjects();
      let tagdata = await this.getTags();
      this.tags = tagdata.map((item, index) => {
        let tagIndex = findIndex(this.tagTypeItems, function (o) {
          return o.key == item.tagType;
        });
        return { ...item, index, tagLabel: this.tagTypeItems[tagIndex].name };
      });
      var sortTags = function (a, b) {
        if (a.name > b.name) return 1;
        else return -1;
      };
      this.filterAudienceTags = this.tags
        .filter((item) => item.tagLabel == "FilterAudience")
        .sort(sortTags);
      this.filterTypeTags = this.tags
        .filter((item) => item.tagLabel == "FilterType")
        .sort(sortTags);
      this.filterModeTags = this.tags
        .filter((item) => item.tagLabel == "FilterMode")
        .sort(sortTags);
      this.loadPrograms();
      let res = await this.filterResources({ isProgram: false });
      this.totalResources = Object.assign([], res.results);
      this.totalResources = this.totalResources.filter((item) => {
        if (item.items == null || item.items.length == 0) {
          return item;
        }
      });

      this.isLoading = false;
    },

    async editItem(item) {
      this.editedIndex = this.resources.indexOf(item);
      let res = await this.getResourceDetail(item.id);
      this.form = Object.assign({}, res);
      this.projectChanged();
      this.selectedModules =
        this.form.items != null ? Object.assign([], this.form.items) : [];
      this.dialog = true;
    },

    async deleteItem() {
      await this.deleteResource(this.selectedItemId);
      this.$notify({
        text: "Program deleted successfully",
        type: "success",
      });
      this.deleteConfirmDialog = false;
      this.pagination.pageIndex = 1;
      this.initialize();
    },

    close() {
      this.dialog = false;
      this.form = Object.assign({}, this.defaultItem);
      this.selectedModules = [];
      this.resourceKeyword = null;
      this.searchResource();
      this.editedIndex = -1;
      this.selectedTags = [];
      setTimeout(() => {
        this.$v.$reset();
      }, 100);
    },

    async save() {
      this.selectedModules = this.selectedModules.map((item, index) => ({
        ...item,
        itemNum: index + 1,
      }));
      this.form.items = [];
      for (let i = 0; i < this.selectedModules.length; i++) {
        this.form.items.push(this.selectedModules[i].id);
      }
      if (this.editedIndex > -1) {
        let res = await this.updateResource(this.form);
        if (res.errors == null) {
          this.$notify({
            text: "Program updated successfully",
            type: "success",
          });
          this.initialize();
          this.close();
        } else {
          this.$notify({
            text: res.errors[0].errorMessage,
            type: "error",
          });
        }
      } else {
        let res = await this.addResource(this.form);
        if (res.errors == null) {
          this.$notify({
            text: "Program added successfully",
            type: "success",
          });
          this.initialize();
          this.close();
        } else {
          this.$notify({
            text: res.errors[0].errorMessage,
            type: "error",
          });
        }
      }
      this.initialize();
      this.close();
    },

    getProjectName(id) {
      let project = this.projects.filter((item) => item.id == id);
      return project.length > 0 ? project[0].name : "";
    },

    showDeleteConfirmDialog(item) {
      this.deleteConfirmDialog = true;
      this.selectedItemId = item.id;
    },

    async projectChanged() {
      this.isModuleLoading = true;
      this.selectedModules = [];
      let payload = {
        isProgram: false,
        projectId: this.form.projectId,
      };
      let res = await this.filterResources(payload);
      this.totalResources = Object.assign([], res.results);
      this.totalResources = this.totalResources.filter((item) => {
        if (item.items == null || item.items.length == 0) {
          return item;
        }
      });
      this.isModuleLoading = false;
    },

    async loadPrograms() {
      this.isLoading = true;
      if (this.search && this.search.length > 0) {
        this.filters["searchText"] = this.search;
      } else {
        delete this.filters["searchText"];
      }
      if (this.sort.sortBy) {
        this.filters = { ...this.filters, ...this.sort };
      }
      this.filters["isProgram"] = true;
      this.filters.pageIndex = this.pagination.pageIndex;
      this.filters.pageSize = this.pagination.pageSize;
      let res = await this.filterResources(this.filters);
      this.resources = res.results;
      this.pagination.pageSize = res.pageSize;
      this.pagination.total = res.total;
      this.pagination.pageIndex = res.currentPage;
      this.isLoading = false;
    },

    searchInput: debounce(async function () {
      this.pagination.pageIndex = 1;
      this.loadPrograms();
    }, 500),

    searchResource: debounce(async function () {
      let payload = {
        isProgram: false,
        searchText: this.resourceKeyword,
      };
      if (this.form.projectId) {
        payload["projectId"] = this.form.projectId;
      }
      let res = await this.filterResources(payload);
      this.totalResources = Object.assign([], res.results);
      this.totalResources = this.totalResources.filter((item) => {
        if (!item.isProgram) {
          if (item.items == null || item.items.length == 0) {
            let isSelected = findIndex(this.selectedModules, function (o) {
              return o.id == item.id;
            });
            if (isSelected == -1) {
              return item;
            }
          }
        }
      });
    }, 300),
  },
};
</script>
