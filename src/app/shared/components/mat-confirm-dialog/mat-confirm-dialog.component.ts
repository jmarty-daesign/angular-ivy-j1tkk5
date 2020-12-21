import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'mat-confirm-dialog',
    templateUrl: './mat-confirm-dialog.component.html',
    styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent implements OnInit {

    constructor( @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialogRef<MatConfirmDialogComponent>) {
        
    }

    ngOnInit() {

    }
    
    closeDialog(){
        this.dialog.close();
    }

}
