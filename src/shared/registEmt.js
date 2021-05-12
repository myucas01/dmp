import Vue from 'vue'
import {
  Message, Input, Tabs, TabPane, Button, Form, FormItem, Tooltip, Progress, Row,
  Col, Upload, Dialog, Select, Option, OptionGroup, MessageBox, Cascader,
  Checkbox, Dropdown, DropdownMenu, DropdownItem, Breadcrumb, BreadcrumbItem,
  menu, MenuItem, MenuItemGroup, Scrollbar, TableColumn, Table, Loading
} from 'element-ui'

const components = [
  Message, Input, Tabs, TabPane, Button, Form, FormItem, Tooltip, Progress, Row,
  Col, Upload, Dialog, Select, Option, OptionGroup, MessageBox, Cascader,
  Checkbox, Dropdown, DropdownMenu, DropdownItem, Breadcrumb, BreadcrumbItem,
  menu, MenuItem, MenuItemGroup, Scrollbar, TableColumn, Table, Loading
]

register(components)

function register(components) {
  components.forEach(item => {
    Vue.use(item)
  })
}
