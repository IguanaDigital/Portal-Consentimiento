import { Component, Input } from "@angular/core";
/**
 * Componente para textos con estilos predefinidos
 *
 * @string textType - nombre de la clase de css
 *
 */
@Component({
  selector: "app-text",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.css"],
})
export class TextComponent {
  @Input() textType: string = "";
}
