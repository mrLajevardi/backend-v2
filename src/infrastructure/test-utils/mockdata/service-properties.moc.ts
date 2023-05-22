import { User } from "../../database/entities/User"
import { ServiceInstances } from "../../database/entities/ServiceInstances"

export const servicePropertiesMocData = [
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "id",
      value: "111111",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "template_id",
      value: "6331",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "client_id",
      value: "me",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "image",
      value: "runpod/stable-diffusion:web-automatic-2.1.16",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "env",
      value: `{
       "JUPYTER_DIR": "/",
        "-p 3000:3000": "1"
        }`,
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "args_str",
      value: "",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "onstart",
      value: "touch ~/.no_auto_tmux; /start.sh;",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "runtype",
      value: "jupyter_direc ssh_direc ssh_proxy",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "use_jupyter_lab",
      value: "true",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "jupyter_dir",
      value: "",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "python_utf8",
      value: "",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "lang_utf8",
      value: "",
    },
    {
      ServiceInstanceID: "1A20E61D-21D9-414F-B5D9-814BB5C220CE" ,
      PropertyKey: "disk",
      value: "59.71",
    },
  ]