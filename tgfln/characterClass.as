package {
	
	import flash.display.SimpleButton;
	import fl.transitions.Tween;
	
	public class characterClass extends SimpleButton {
		
		var characterTween:Tween;
		
		public function characterClass() {
			
			characterTween = new Tween(this, "alpha", null, 0, 1, 2, true);
		}
	}
}