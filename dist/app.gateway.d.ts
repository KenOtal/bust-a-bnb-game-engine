import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { AuditoriesService } from './auditories/auditories.service';
import { RoundService } from './rounds/rounds.service';
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly appService;
    private readonly roundService;
    private readonly auditoriesService;
    server: Server;
    private logger;
    private game;
    private seedsList;
    private roundNumber;
    private houseEdge;
    constructor(appService: AppService, roundService: RoundService, auditoriesService: AuditoriesService);
    afterInit(): Promise<void>;
    subscribeToGameEntityEvents(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
