import common from "./common"
import maintenance from "./maintenance"
import login from "./login.js"
import project from "./project.js"
import oil from "./oil.js"
import qualitys from "./qualitys.js"
import collection from "./collection.js"
import message from "./message.js"
import person from "./person.js"


const api = {
  ...common,
  ...maintenance,
  ...login,
  ...project,
  ...oil,
  ...qualitys,
  ...collection,
  ...message,
  ...person
}
export default api
