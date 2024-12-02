/**
 * 
 */
package edu.cs.cs4650.mapreduce;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import edu.cs.cs4650.mapreduce.SongPlayCount.SongCountMapper;
import edu.cs.cs4650.mapreduce.SongPlayCount.SongCountReducer;

/**
 * @author apoloimagod
 *
 */
public class SongFirstLastPlay {
	
	private static final SimpleDateFormat format =
			new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
	
	public static class SongDatesMapper extends Mapper<Object, Text, Text, SongDatesTuple> {

		@Override
		protected void map(Object key, Text value, Context context)
				throws IOException, InterruptedException {
			
			SongDatesTuple datesTuple = new SongDatesTuple();
			
			String row = value.toString();
			String[] rowValues = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
			
			if (rowValues[0].compareTo("SONG RAW") != 0) {
				String songName = rowValues[1];			
				String playDate = rowValues[5];
				
				Date frmtPlayDate = new Date();
				
				try {
					frmtPlayDate = format.parse(playDate);
					datesTuple.setFirst(frmtPlayDate);
				} catch (ParseException e) {
					e.printStackTrace();
				}
				
				datesTuple.setFirst(frmtPlayDate);
				datesTuple.setLast(frmtPlayDate);
				
				context.write(new Text(songName), datesTuple);

			}

		}
		
	}
	
	public static class SongDatesReducer
				extends Reducer<Text, SongDatesTuple, Text, SongDatesTuple> {

		@Override
		protected void reduce(Text key, Iterable<SongDatesTuple> values, Context context)
				throws IOException, InterruptedException {
			
			SongDatesTuple result = new SongDatesTuple();
			result.setFirst(null);
			result.setLast(null);
			
			for (SongDatesTuple tup : values) {
				if (result.getFirst() == null
						|| tup.getFirst().compareTo(result.getFirst()) < 0) {
					result.setFirst(tup.getFirst());
				}
				
				if (result.getLast() == null
						|| tup.getLast().compareTo(result.getLast()) > 0) {
					result.setLast(tup.getLast());
				}
			}
			
			context.write(key, result);
		}
		
	}

	/**
	 * @param args
	 * @throws IOException 
	 * @throws InterruptedException 
	 * @throws ClassNotFoundException 
	 */
	public static void main(String[] args)
			throws IOException, ClassNotFoundException, InterruptedException {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf,"song dates");
		job.setJarByClass(SongFirstLastPlay.class);
		job.setMapperClass(SongDatesMapper.class);
		job.setCombinerClass(SongDatesReducer.class);
		job.setReducerClass(SongDatesReducer.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(SongDatesTuple.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}

}
