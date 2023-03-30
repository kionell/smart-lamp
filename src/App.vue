<template>
  <router-view
    class="app-view"
    @contextmenu="$event.preventDefault()"
  />

  <div
    class="app-navigation"
    @contextmenu="$event.preventDefault()"
  >
    <router-link to="/">
      <span>{{ $t('homePage') }}</span>
    </router-link>

    <router-link to="/matrix">
      <span>{{ $t('matrixPage') }}</span>
    </router-link>
  </div>
</template>

<style lang="scss">
@import './assets/themes/dark';

* {
  font-family: sans-serif;
}

html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-view {
  flex-grow: 1;
  flex-basis: auto;
}

.app-navigation {
  display: flex;
  flex-basis: 50px;
  position: relative;
  z-index: 9999;

  background-color: $main-color;
  box-shadow: 0px -4px 5px rgba(0, 0, 0, 0.3);

  a, a:hover, a:visited, a:active {
    background-color: $main-color;
    color: $text-color;
    text-decoration: none;
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;

    transition: 0.25s;
  }

  a:hover {
    background-color: $highlight-color;
  }
}

.boxes {
  border-radius: 8px;
  background-color: $main-color;
  width: 90%;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  margin-bottom: 20px;
}

.box-names {
  background-color: $secondary-color;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $text-color;
  height: 50px;
  font-size: 20px;
}

.box-storages {
  padding: 20px;
}

.forms {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}

.form-fields {
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 40px;
  text-align:start;
  width: 100%;

  .name {
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color;
    background: $secondary-color;
    user-select: none;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .value {
    flex: 1;
    height: 40px;
    min-width: 100px;
    border: 0;
    font-size: inherit;
    color: $text-color;
    background: $highlight-color;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
  }
  input[type="range"] {
    padding: 0px;
    margin-left: 10px;
  }
  .switch {
    padding: 0px;
    margin-left: 10px;
  }
}

.slider {
  background-color: $highlight-color;
}

input:checked + .slider {
  background-color: $selected-color;
}

input:focus + .slider {
  box-shadow: 0 0 1px $selected-color;
}

.form-fields:not(:last-child) {
  margin-bottom: 15px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.buttons:after {
  content: attr(translation);
  position: absolute;
  left: 40%;
  top: 70%;
  z-index: 1;
  pointer-events: none;
  width: max-content;
  padding: 10px;
  border-radius: 5px;
  background-color: $background-color;
  color: $text-color;
  opacity: 0;
  transition: opacity 0.5s;
}

.buttons:hover:after {
  opacity: 1;
  transition-delay: 1s;
}

.select-buttons {
  width: 100%;
  height: 30px;
  background-color: $selected-color;
  color: $text-color;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  box-sizing: border-box;
  transition: 0.5s;
  font-size: 14px;

  &:hover {
    background-color: lighten($selected-color, 15%);
  }
}

.text {
  color: $text-color;
}

hr {
  width: 100%;
  margin-top: 25px;
  margin-bottom: 25px;
  background-color: $text-color;
}

svg {
  display: block;
}

.mirrored {
  transform: scaleX(-1);
}

.rotated {
  transform: rotate(90deg);
}

.inactive {
  color: darken($text-color, 50%)
}

.selected {
  background-color: $selected-color !important;
}

.ps {
  width: 100%;
  height: 100%;
}

input[type="text"] {
  background-color: $highlight-color;
  box-sizing: border-box;
  border: 0;
}
</style>
