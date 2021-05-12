<template>
  <div class="picker_wrap">
    <div class="picker_input">
      <el-input
        v-model="pickerVal"
        placeholder="请选择日期"
        prefix-icon="el-icon-date"
        :disabled="disabledVal"
        @focus="openDialog"
      />
    </div>
    <!-- dialog -->
    <div v-show="pickerShow" id="dateTimePicker_wrap" v-clickoutside="handleClose" class="dateTimePicker_wrap">
      <div class="header">
        <p class="header_times">{{ pickerVal }}</p>
        <div class="header_btns">
          <el-button type="text" @click="pickerShow = false">取消</el-button>
          <el-button type="primary" @click="confirmData">确认</el-button>
        </div>
      </div>
      <div class="content">
        <div class="content_item left">
          <a-range-picker
            :default-value="dealDate(timeVal)"
            :default-picker-value="dealDate(timeVal)"
            :open="true"
            :get-calendar-container="getParent()"
            :format="dateFormat"
            dropdown-class-name="diyClass"
            @change="handleChange"
          />
        </div>
        <div v-if="timeOption" class=" right">
          <ul>
            <li v-for="item of timeOption" :key="item.name" :class="{'active': timeVal.key == item.key}" @click="chooseCode(item)">{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Clickoutside from '@utils/clickoutside'

export default {
  name: 'DateTimePicker',
  directives: { Clickoutside },
  model: {
    prop: 'timePickerVal',
    event: 'change'
  },
  props: {
    /**
       * 是否可编辑
       * 类型 Boolean
       */
    disabledVal: {
      type: Boolean,
      default: false,
      required: false
    },
    /**
       * v-model自定义绑定值
       * 类型 String
       */
    timePickerVal: {
      type: Object,
      default: null,
      required: true
    },
    timeOption: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      pickerShow: false,
      dateFormat: 'YYYY-MM-DD',
      type: '',
      timeVal: this.timePickerVal,
      rangePickerVal: '',
      value: null
    }
  },
  computed: {
    pickerVal() {
      if (this.timeVal) {
        return this.timeVal.name
      } else {
        return null
      }
    }
  },
  methods: {
    moment,
    dealDate() {
      if (this.timeVal.type === 'date') {
        return this.timeVal.key.split('|')
      } else {
        return null
      }
    },
    openDialog() {
      const _this = this
      _this.pickerShow = true
    },
    getParent(trigger) {
      return trigger => trigger.parentNode
    },
    confirmData() {
      this.pickerShow = false
      this.$emit('change', this.timeVal)
    },
    handleChange(date, dateString) {
      this.type = 'rangePicker'
      this.rangePickerVal = {
        key: dateString.join('|'),
        name: dateString.join('|'),
        value: dateString.join('|'),
        type: 'date'
      }
      this.timeVal = this.rangePickerVal
      this.$emit('change', this.timeVal)
    },
    chooseCode(item) {
      this.type = 'code'
      this.timeVal = {
        ...item,
        type: 'code'
      }
      this.$emit('change', this.timeVal)
    },
    handleClose() {
      if (this.pickerShow) {
        this.pickerShow = false
      }
    }
  }
}
</script>

<style scoped lang="less">
  .picker_wrap {
    position: relative;
    height: 40px;

  }

  .dateTimePicker_wrap {
    /*width: 675px;*/
    height: 365px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(221, 222, 225, 1);
    box-shadow: -4px 3px 10px 4px rgba(115, 124, 137, .21);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    .header {
      /*width: 675px;*/
      height: 50px;
      border-bottom: 1px solid #ECF0F4;
      position: relative;

      &_times {
        font-size: 14px;
        font-weight: 600;
        color: rgba(71, 86, 105, 1);
        line-height: 50px;
        margin-left: 20px;
      }

      &_btns {
        position: absolute;
        top: 7px;
        right: 13px;
        /deep/ .el-button--primary {
          width: 64px;
          height: 32px;
          font-size: 12px;
          line-height: 8px;
          &:hover{
            color: #fff !important;
          }
        }

        /deep/ .el-button--text {
          font-weight: 400;
          color: rgba(101, 113, 128, 1);
          font-size: 12px;
          margin-right: 10px;
          &:hover{
            color: rgba(101, 113, 128, 1)!important;
          }
        }
      }
    }

    .content {
      overflow: hidden;

      &_item {
        float: left;
        height: 313px;
      }

      .left {
        width: 515px;
        padding-top: 10px;
        padding-left: 10px;
      }

      .right {
        height: 313px;
        margin-left: 515px;
        background: rgba(249, 250, 252, 1);
        padding-left: 10px;

        ul {
          padding: 10px 0 0 0;
          overflow: hidden;

          li {
            width: 64px;
            height: 32px;
            background: rgba(233, 234, 236, 1);
            border-radius: 4px;
            float: left;
            text-align: center;
            line-height: 32px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(71, 86, 105, 1);
            cursor: pointer;
            margin-right: 10px;
            margin-bottom: 10px;

            &:nth-child(2n+2) {
              margin-right: 0;
            }
          }

          .active {
            background: rgba(239, 219, 252, 1);
            font-weight: 600;
            color: rgba(147, 12, 234, 1);
          }
        }
      }
    }
  }

  .picker_input {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
<style lang="less">
  .el-date-range-picker {
    width: 500px !important;
    border: none;
    box-shadow: none;
    left: 220px !important;
  }

  .el-date-range-picker__content {
    padding: 10px;
  }

  .popper__arrow {
    display: none !important;

    &:after {
      display: none !important;;
    }
  }

  .diyClass {
    width: 515px;

    .ant-calendar-range {
      width: 500px;
      box-shadow: none;
    }

    .ant-calendar-input-wrap {
      display: none;
    }
  }

</style>
