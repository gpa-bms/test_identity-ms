import { Module } from "@nestjs/common";
import { ClientProxyBMS } from "./proxy.client";

@Module({
    providers: [ClientProxyBMS],
    exports: [ClientProxyBMS],
})
export class ProxyModule { }