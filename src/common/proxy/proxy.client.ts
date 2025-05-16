import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RabbitMQ } from "../constants/constants";


@Injectable()
export class ClientProxyBMS {
    constructor(private readonly config: ConfigService) {
    }

    clientProxyIdentity(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: this.config.get('AMQP_URL'),
                queue: RabbitMQ.IdentityQueue
            }
        })
    }
}



