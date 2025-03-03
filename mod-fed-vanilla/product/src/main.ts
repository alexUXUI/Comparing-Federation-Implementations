import { loadRemote } from "@module-federation/enhanced/runtime";
import "./index.css";

loadRemote("service/component")
  .then((module: any) => {
    return module;
  })
  .catch((err: any) => {
    console.error(err);
  });

loadRemote("services/user")
  .then((module: any) => {
    console.log("user serivce loaded in product");
    console.log(module);
    // module.User.setName("Alex Bennett");
    const name = module.User.getName();
    console.log(name);
    return module;
  })
  .catch((err: any) => {
    console.error(err);
  });
