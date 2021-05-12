import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from 'src/app/login-module/login.service';
import MensagemChat from 'src/app/model/cscl/chat/mensagemChat';
import { ChatService } from '../../cscl/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatGrupoComponent implements OnInit, OnChanges {

  mensagens$;
  mensagens;
  mensagem:MensagemChat;
  visibilidade;
  usuarioLogado;
  participantes;

  @ViewChild('scroll') scroll;
  @Input("atividadeGrupo") atividadeGrupo;
  @Input("grupo") grupo;

  constructor(private loginService:LoginService, private chatService:ChatService, private changeDetectorRef: ChangeDetectorRef ) {
    this.usuarioLogado = this.loginService.getUsuarioLogado();
    this.mensagem = new MensagemChat(null, this.usuarioLogado, "", this.grupo, this.atividadeGrupo);
    this.visibilidade = true;

    this.mensagens = [];
    
    this.mensagens$ = new BehaviorSubject([]);

    /* this.chatService.observerChat.subscribe(mensagem =>{
      this.mensagens.push(mensagem);
    }) */

  
    this.chatService.observerChat.subscribe(mensagem=>{
      this.mensagens.push(mensagem);
      this.mensagens$.next(this.mensagens);
      this.changeDetectorRef.detectChanges();
      let height = this.scroll.el.nativeElement.getBoundingClientRect().height*this.mensagens.length;
      this.scroll.scrollTop(height);
    })

    
   }
   
  ngOnChanges(changes: SimpleChanges): void {
    if(this.atividadeGrupo != null){
      this.mensagem.atividadeGrupo = this.atividadeGrupo;

      
    }

    if(this.grupo != null){
      this.chatService.carregarMensagens(this.grupo);
    }

    
  }

  ngOnInit(): void {
   
  }

  getHeader(estudante){
    return estudante instanceof Object?estudante.nome:estudante;
  }


  
  enviar(){
    if(this.grupo != null && this.atividadeGrupo != null){
      this.mensagem.atividadeGrupo = this.atividadeGrupo;
      this.mensagem.grupo = this.grupo;
      this.chatService.enviarMensagem(this.mensagem).subscribe(()=>{
        this.mensagem.texto = "";
  
      })
    }
    
  }

}
