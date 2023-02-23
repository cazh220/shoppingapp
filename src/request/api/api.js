import common from "./common"
import login from "./login.js"
import goods from "./goods"
import order from "./order"


const api = {
  ...common,
  ...login,
  ...goods,
  ...order
}
export default api
