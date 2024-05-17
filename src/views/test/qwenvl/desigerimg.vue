<template>
  <div class="container">
    <!-- Default button -->
    <el-button type="default">Default</el-button>

    <!-- Primary color button -->
    <el-button type="primary">Primary</el-button>

    <!-- Success color button -->
    <el-button type="success">Success</el-button>

    <!-- Info color button -->
    <el-button type="info">Info</el-button>

    <!-- Warning color button -->
    <el-button type="warning">Warning</el-button>

    <!-- Danger color button -->
    <el-button type="danger">Danger</el-button>

    <!-- Plain style buttons with different colors and types -->
    <p>Plain Style:</p>
    <el-button plain type="primary" size="small">Small Primary Button (plain)</el-button>
    <br />
    <el-button plain type="primary" size="medium">Medium Primary Button (plain)</el-button>
    <br />
    <el-button plain type="primary" size="large">Large Primary Button (plain)</el-button>

    <!-- Round style buttons with different colors and sizes -->
    <p>Round Style:</p>
    <el-button round type="primary" size="small">Small Primary Button (round)</el-button>
    <br />
    <el-button round type="primary" size="medium">Medium Primary Button (round)</el-button>
    <br />
    <el-button round type="primary" size="large">Large Primary Button (round)</el-button>

    <!-- Checkbox, checkbox-circle, star icon buttons -->
    <p>Icon Buttons:</p>
    <el-checkbox v-model="checked"></el-checkbox>
    <br/>
    <el-icon :type="'check'"></el-icon>
    <br/>
    <el-icon :type="'star-empty'" circle></el-icon>
    <br/>
    <el-button type="text"><i slot="icon" class="el-icon-delete"></i>Delete</el-button>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
const checked = false;
export default defineComponent({
  components: {},
});
</script>

<style scoped>
.container {
  display: flex;
}
</style>
