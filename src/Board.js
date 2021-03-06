// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },
    //Navigate to specific squares within the matrix.

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var  row = this.rows()[rowIndex];
      var  numOfQueens =0;
      var conflict;
      for(var i = 0;i<row.length;i++){
        if(row[i] === 1){
          numOfQueens++;
        }
      }
      conflict = numOfQueens >1? true:false;
      return conflict;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var result = false;
      var rows = this.rows();

      //for loop that goes through the rows of the board
      for(var i = 0; i < rows.length; i++) {
        //passes that row through hasRowConflictAt
        //var row = rows[i];
        var eval = this.hasRowConflictAt(i);
          if(eval) {
            result = eval;
            return result;
          }
      }
      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // want to get a column using the column index
      // traverse the column for any conflicts
      // return the result for any conflicts found

      //create result
      var result = false;
      //grab all the rows
      var rows = this.rows();
      //counter
      var counter = 0;
      // use a for-loop to traverse the rows
      for(var i = 0; i < rows.length; i++) {
        // use column index to search the same position in each row
        var rowColIndex = rows[i][colIndex];
        // check for one or zero value
          if(rowColIndex) {
            // increase counter
            counter++;
          }
      }

      // if counter > 1
      if(counter > 1) {
        // set result to true
        result = true;
      }
      return result; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //grab all rows
      var rows = this.rows();
      var hasColConflict;
      //traverse the rows using for loop
      for(var i = 0; i < rows.length; i++) {
        //call hasColConflictAt passing in counter; returned value set to variable
        hasColConflict = this.hasColConflictAt(i);
          //if that variable === true
          if(hasColConflict) {
            return true;
          }
      }
      return false; // fixme
    },

    isQueen: function(tuple) {
      return this.rows()[tuple[0]][tuple[1]];
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var maxTimeRun = this.rows().length;
      //set variable called maxTimeRun = this.rows.length
      var timeRun=0;
      //set variable timeRun to 0;
      var counter = 0;
      //set a counter variable
      var startLocation = [0,majorDiagonalColumnIndexAtFirstRow];
      var context = this;
      //set a variable [0,majorDiagonalColumnIndexAtFirstRow]
      var recursive=function(tuple){
        if(context._isInBounds(tuple[0],tuple[1]) && context.isQueen([tuple[0],tuple[1]]) ===1 && timeRun<maxTimeRun){
        //if location is in bounds and location is equal to 1 && timeRun<=maxTimeRun
          counter++;
            //increase counter variable
          timeRun++;
            //increase timeRun
          return recursive([tuple[0]+1,tuple[1]+1]);
            //call recursive function passing in location row and column by 1
        }else{
        //else
          timeRun++;
          //  increase timeRun
          if(timeRun< maxTimeRun){
          //  if timeRun <= maxTimeRun
            return recursive([tuple[0]+1,tuple[1]+1]);
            //  call recursive function passing in location row and column by 1
          }
        }
      };

      recursive(startLocation);
      //call recursive function passing tuple
      if(counter>1){
        return true;
      }else{
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //will only work if n>2
      //set var starting point
      var startingPoint = this._getFirstRowColumnIndexForMajorDiagonalOn(this.rows().length-1, 0);
      var context = this;
      //set var timeRun = 0
      var timeRun = 0;
      //set var maxTimeRun = this.rows().length + 2
      var maxTimeRun = this.rows().length + (this.rows().length-1);
      var nextColumn;
      //set var recurse function which takes startingPoint
      var recurse = function(rowZeroColumnN) {
        //set a var majorDiagonalConflict, instatiate with the return call from hasMajorDiagonalConflictAt(rowZeroColumnN)
        var majorDiagonalConflict =  context.hasMajorDiagonalConflictAt(rowZeroColumnN);
        //inscrease timeRun
        timeRun++;
        //check if majorDiagonalConflict
        if(majorDiagonalConflict) {
          //return true
          return true;
        } else if (timeRun < maxTimeRun) {
        //else if timeRun < maxTimeRun
          //recurse using rowZeroColumnN++
          nextColumn = rowZeroColumnN + 1;
          return recurse(nextColumn);
        } else {
          return false;
        }
      };
      //since recurse is returning boolean, we need to return the initial invocation on line 247

      //press 4 times after load to reach grid with major diagonal error
      return recurse(startingPoint);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var maxTimeRun = this.rows().length;
      //set variable called maxTimeRun = this.rows.length
      var timeRun=0;
      //set variable timeRun to 0;
      var counter = 0;
      //set a counter variable
      var startLocation = [0,minorDiagonalColumnIndexAtFirstRow];
      var context = this;
      //set a variable [0,majorDiagonalColumnIndexAtFirstRow]
      var recursive=function(tuple){
        if(context._isInBounds(tuple[0],tuple[1]) && context.isQueen([tuple[0],tuple[1]]) ===1 && timeRun<maxTimeRun){
        //if location is in bounds and location is equal to 1 && timeRun<=maxTimeRun
          counter++;
            //increase counter variable
          timeRun++;
            //increase timeRun
          return recursive([tuple[0]+1,tuple[1]-1]);
            //call recursive function passing in location row and column by 1
        }else{
        //else
          timeRun++;
          //  increase timeRun
          if(timeRun< maxTimeRun){
          //  if timeRun <= maxTimeRun
            return recursive([tuple[0]+1,tuple[1]-1]);
            //  call recursive function passing in location row and column by 1
          }
        }
      };

      recursive(startLocation);
      //call recursive function passing tuple
      if(counter>1){
        return true;
      }else{
        return false;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
    //will only work if n>2
      //set var starting point
      var startingPoint = this._getFirstRowColumnIndexForMinorDiagonalOn(this.rows().length-1, this.rows().length-1);
      var context = this;
      //set var timeRun = 0
      var timeRun = 0;
      //set var maxTimeRun = this.rows().length + 2
      var maxTimeRun = this.rows().length + (this.rows().length-1);
      var nextColumn;
      //set var recurse function which takes startingPoint
      var recurse = function(rowZeroColumnN) {
        //set a var majorDiagonalConflict, instatiate with the return call from hasMajorDiagonalConflictAt(rowZeroColumnN)
        var minorDiagonalConflict = context.hasMinorDiagonalConflictAt(rowZeroColumnN);
        //inscrease timeRun
        timeRun++;
        //check if majorDiagonalConflict
        if(minorDiagonalConflict) {
          //return true
          return true;
        } else if (timeRun < maxTimeRun) {
        //else if timeRun < maxTimeRun
          //recurse using rowZeroColumnN++
          nextColumn = rowZeroColumnN -1;
          return recurse(nextColumn);
        } else {
          return false;
        }
      };
      //since recurse is returning boolean, we need to return the initial invocation on line 247
      //press 4 times after load to reach grid with major diagonal error
      return recurse(startingPoint);
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
