<template>
  <v-list-item
    ref="wrapper"
    class="mt-2"
    :class=" { 'opened' : opened, 'overflowed': heightOverflowed }"
  >
    <v-list-item-avatar tile size="64" ref="avatar">
      <img :src="item.projectLogo">
    </v-list-item-avatar>

    <v-list-item-content ref="content">
      <span v-if="!item.isProgram" class="black--text heading" @click="viewResource(item)" aria-controls>
        <v-avatar size="24" color="white">  
          <v-icon size="18" color="black">{{ 'mdi-' + item.typeLogo }}</v-icon>
        </v-avatar>
          {{item.title}}
      </span>
      <span v-if="item.isProgram" class="black--text heading program" @click="viewResource(item)" aria-controls>{{item.title}}</span>

      <div v-html="item.overview" v-if="item.overview" class="mt-2 overview mb-0"></div>
      <p v-if="!item.isProgram && item.items && item.items.length > 0" class="mt-6">
        Module {{ item.items[0].itemNum }} of <a @click="viewProgram(item.items[0].id, 'SUMMARY')">{{ item.items[0].title }}</a>
      </p>
      <p class="mt-2 mb-0" v-if="!item.isProgram && item.duration">Duration {{ item.duration }}</p>
      <p v-if="item.endorsements">{{ item.endorsements }}</p>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn icon @click="toggleResource" v-if="heightOverflowed">
        <v-icon color="grey lighten-1">{{ opened ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: "ResourceListItem",
  props: {
    item: Object,
    heightLimit: {
      type: Number,
      default: 140
    }
  },
  data() {
    return {
      opened: false,
      heightOverflowed: false
    };
  },
  methods: {
    viewResource(item) {
      this.$emit('view-resource', item);
    },

    viewProgram(item, viewMode) {
      this.$emit('view-program', item, viewMode);
    },

    toggleResource() {
      this.opened = !this.opened;
      if (this.opened) {
        this.$refs.wrapper.$el.style.height = this.$refs.content.clientHeight + 'px';
      } else {
        this.$refs.wrapper.$el.style.height = this.heightLimit + 'px';
      }
    },

    setContentHeight() {
      this.$refs.wrapper.$el.style.height = this.heightLimit + 'px';
      if (this.$refs.content.clientHeight > this.heightLimit) {
        this.heightOverflowed = true;
      } else {
        let height = Math.max(this.$refs.avatar.$el.clientHeight + 32, this.$refs.content.clientHeight);
        this.$refs.wrapper.$el.style.height = height + 'px';
      }
    }
  },
  mounted() {
    this.setContentHeight();
  }
};
</script>

<style lang="scss" scoped>
.v-list-item {
  padding-left: 0;
  overflow: hidden;
  position: relative;
  transition: .5s;

  &.overflowed:not(.opened):after {
    content: "";
    position: absolute;
    left: 64px;
    bottom: 0;
    right: 0;
    height: 50px!important;
    min-height: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0), white);
    // background-image: linear-gradient(white, rgba(255, 255, 255, 0));
  }
}

.heading{
  font-weight: 600;
}

.program {
  text-transform: uppercase;
}

::v-deep .v-list-item__avatar {
  align-self: flex-start;
}

::v-deep .v-list-item__action {
  align-self: flex-start;
}

::v-deep .v-list-item__content {
  align-self: flex-start;
  padding: 16px 0;

  span {
    font-size: 18px;
  }

  p {
    color: #4a4a4a;
    letter-spacing: .5px;
    line-height: 1.5 !important;
  }
}
</style>