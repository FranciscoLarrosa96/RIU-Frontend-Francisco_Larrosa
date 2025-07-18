import { CommonModule } from "@angular/common";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialDesignModule } from "../../shared/material/material-design.module";
import { Hero } from "../../interfaces/hero.interface";
import { UppercaseDirective } from "../../shared/directives/uppercase.directive";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: 'app-hero-dialog',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule, ReactiveFormsModule, UppercaseDirective, MatChipsModule],
  templateUrl: './heroe-dialog.html',
})
export class HeroDialogComponent implements OnInit {
  form!: FormGroup;
  powers: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  hero!: Hero;
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<HeroDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data?: Partial<Hero>) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      id: [this.data?.id || null],
      name: ['', Validators.required],
      alias: ['', Validators.required],
      universe: ['marvel', Validators.required],
      superpowers: this._formBuilder.array([]),
      active: [true],
    });
    if (this.data) this.form.patchValue(this.data);
    this.powers = [...(this.data?.superpowers ?? [])];
  }

  addPower(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.powers.push(value);
    }
    event.chipInput!.clear();
  }

  removePower(power: string): void {
    const index = this.powers.indexOf(power);
    if (index >= 0) {
      this.powers.splice(index, 1);
    }
  }

  save() {
    if (this.form.valid) {
      this.hero = {
        ...this.form.value,
        superpowers: this.powers,
      };
      this._dialogRef.close(this.hero);
    }
    // Si el formulario no es válido, no cerramos el diálogo
  }

  closeDialog() {
    this._dialogRef.close();
  }
}
