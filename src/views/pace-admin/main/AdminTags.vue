<template>
  <div>
    <div class="mt-4">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="tags"
          sort-by="calories"
          class="border"
          :loading="isLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search tags"
                  single-line
                  hide-details
                  @input="searchInput"
                ></v-text-field>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on"><v-icon>mdi-map-marker</v-icon>Add Tag</v-btn>
                </template>
                <v-card>
                  <v-card-title class="bg-pace-yellow">
                    <span class="headline white--text">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field 
                            label="Name" 
                            v-model="form.name"
                            :error-messages="fieldErrors('form.name')"
                            @input="$v.form.name.$touch()"
                            @blur="$v.form.name.$touch()"
                          ></v-text-field>
                          <v-select
                            label="Tag type"
                            :items="tagTypeItems"
                            v-model="form.tagType"
                            :error-messages="fieldErrors('form.tagType')"
                            @blur="$v.form.tagType.$touch()"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="border-pace-orange pace-orange--text" @click="close">Cancel</v-btn>
                    <v-btn class="bg-pace-orange white--text" :disabled="$v.form.$invalid" @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="showDeleteConfirmDialog(item)">mdi-delete</v-icon>
          </template>
          <template slot="item.logo" slot-scope="{ item }">
            <img :src="item.logo" height="48px" class="d-block"/>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
        <v-dialog v-model="deleteConfirmDialog" max-width="400px">
          <v-card>
            <v-card-title class="bg-pace-yellow">
              <span class="headline white--text">Confirm Deletion</span>
            </v-card-title>
            <v-card-text class="pt-2">
              <span class="title black--text">Are you sure you want to delete this item?</span>
            </v-card-text>
            <v-card-actions>
              <v-btn class="border-pace-orange pace-orange--text" @click="deleteConfirmDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="bg-pace-orange white--text" @click="deleteItem">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  required
} from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";
import debounce from "debounce";

export default {
  name: "AdminTags",
  mixins: [validationMixin],
  validations: {
    form: {
      name: { required },
      tagType: { required }
    }
  },
  validationMessages: {
    form: {
      name: {
        required: "Name is required"
      },
      tagType: {
        required: "Tag type is required"
      }
    }
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name"
      },
      { text: "Tag type", value: "tagType" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    tags: [],
    tagTypeItems: [
      "FilterAudience", 
      "FilterType", 
      "FilterMode", 
      "ContentPadegogy", 
      "ContentTopic", 
      "ContentSymptom", 
      "ContentIllness", 
      "ContentContext", 
      "ContentRole"
    ],
    editedIndex: -1,
    defaultItem: {
      name: null,
      tagType: null
    },
    search: null,
    form: {
      name: null,
      tagType: null
    },
    deleteConfirmDialog: false,
    selectedItemId: null,
    isLoading: false
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Tag" : "Edit Tag";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions("tag", ["getTags", "addTag", "updateTag", "deleteTag"]),
    async initialize() {
      this.isLoading = true;
      this.tags = await this.getTags(this.search);
      this.isLoading = false;
    },

    editItem(item) {
      this.editedIndex = this.tags.indexOf(item);
      this.form = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem() {
      this.deleteTag(this.selectedItemId);
    },

    showDeleteConfirmDialog(item) {
      this.deleteConfirmDialog = true;
      this.selectedItemId = item.id;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      if (this.editedIndex > -1) {
        let res = await this.updateTag(this.form);
        this.initialize();
      } else {
        let res = await this.addTag(this.form);
        this.initialize();
      }
      this.close();
    },

    searchInput: debounce(async function () {
      this.initialize();
    }, 500)
  }
};
</script>
<style lang="sass" scoped>
.subtitle 
  color: #314b5f
</style>