import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetInterface, PetService } from '../../service/pet';

@Component({
  selector: 'app-pet-form',
  standalone: false,
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css'
})
export class PetForm implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      especie: ['', Validators.required],
      idade: [null, [Validators.required, Validators.min(0)]],
      tutor: ['', Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.petService.getById(this.id).subscribe((pet) => {
        this.form.patchValue(pet);
      });
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const pet: PetInterface = this.form.value;

      if (this.id) {
        this.petService.update(this.id, pet).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.petService.create(pet).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
