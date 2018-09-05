/*
  @author Ariana Fairbanks
  @author Nick Foster
*/

function calcFib()
{
    // This function is done. It is just an example.
    var n = document.getElementById('input').value;
    var sequence = [];

    if(n == 1)
        sequence.push(0);
    else if(n >1){
    //add the first two values to the list
        sequence.push(0);
        sequence.push(1);
        let count = 2;

        while(count < n){
            sequence.push(sequence[count-1] + sequence[count-2]);
            count += 1;
        }
    }
    alert(sequence);

}

function checkBalance() {
    // Your code goes here:
    var s = document.getElementById('input2').value;
    var string = [];

    let count = 0;
    let value = true;

    while (count < s.length)
     {
       let current = s[count];
       let length = string.length;
      if (current == '(' || current == '{' || current == '[')
      {
        string.push(current);
      }
       else if(length > 0)
        {

          if ((current == ')' && string[length - 1] == '(') ||
                   (current == ']' && string[length - 1] == '[') ||
                   (current == '}' && string[length - 1] == '{')
                   )
                   {
                     string.pop();
                   }
                   else {
                     value = false;
                   }
      }
      else
       {
          value = false;
      }
      count++;
    }
      // Use alert() to report the checking result of the input string.
      // true if the string is balanced or false if it is not balanced. .
      if(string.length > 0)
      {
        value = false;
      }
      alert(value);

}
